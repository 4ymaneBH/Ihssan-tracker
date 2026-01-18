// Export Service - Analytics export to CSV and PDF
// Using legacy expo-file-system API for compatibility
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { getDateString } from '../utils';

// Types
export interface DayData {
  date: string;
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  adhkarMorning: boolean;
  adhkarEvening: boolean;
  quranPages: number;
  quranMinutes: number;
  charityCount: number;
  tahajjud: boolean;
  customHabitsCompleted: number;
  customHabitsTotal: number;
}

export interface ReportData {
  title: string;
  period: string;
  days: DayData[];
  summary: {
    totalPrayers: number;
    onTimePrayers: number;
    latePrayers: number;
    missedPrayers: number;
    adhkarDays: number;
    totalQuranPages: number;
    totalQuranMinutes: number;
    totalCharity: number;
    tahajjudNights: number;
    customHabitsCompleted: number;
    customHabitsTotal: number;
  };
}

// Helper: Get all dates in a range
export const getDatesInRange = (startDate: Date, endDate: Date): string[] => {
  const dates: string[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(getDateString(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

// Get all dates in a month (Wrapper)
export const getMonthDates = (year: number, month: number): string[] => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  return getDatesInRange(startDate, endDate);
};

// Get dates for a specific week (starts on Sunday or Monday based on implementation, assuming Sunday for now)
export const getWeekDates = (startDateStr: string): string[] => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  return getDatesInRange(startDate, endDate);
};

// Get month name
export const getMonthName = (month: number, locale: string = 'en'): string => {
  const date = new Date(2024, month, 1);
  return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { month: 'long' });
};

// Gather report data from stores
export const gatherReportData = (
  dates: string[],
  title: string,
  period: string,
  salatLogs: Record<string, any>,
  habitsState: {
    adhkarLogs: Record<string, any>;
    quranLogs: Record<string, any>;
    charityLogs: any[];
    tahajjudLogs: Record<string, any>;
    customHabits?: any[];
    customHabitLogs?: any[];
  }
): ReportData => {
  const days: DayData[] = [];

  let totalPrayers = 0;
  let onTimePrayers = 0;
  let latePrayers = 0;
  let missedPrayers = 0;
  let adhkarDays = 0;
  let totalQuranPages = 0;
  let totalQuranMinutes = 0;
  let totalCharity = 0;
  let tahajjudNights = 0;
  let totalCustomCompleted = 0;
  let totalCustomHabits = 0;

  for (const date of dates) {
    const salatLog = salatLogs[date];
    const morningAdhkar = habitsState.adhkarLogs[`adhkar-${date}-morning`];
    const eveningAdhkar = habitsState.adhkarLogs[`adhkar-${date}-evening`];
    const quranLog = habitsState.quranLogs[date];
    const tahajjudLog = habitsState.tahajjudLogs[date];

    // Count charity for this date
    const charityForDay = habitsState.charityLogs.filter(c => c.date === date).length;

    // Process salat
    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
    let dayPrayers = { fajr: '-', dhuhr: '-', asr: '-', maghrib: '-', isha: '-' };

    if (salatLog) {
      for (const prayer of prayers) {
        const status = salatLog[prayer];
        if (status === 'onTime') {
          dayPrayers[prayer] = 'On Time';
          onTimePrayers++;
          totalPrayers++;
        } else if (status === 'late') {
          dayPrayers[prayer] = 'Late';
          latePrayers++;
          totalPrayers++;
        } else if (status === 'missed') {
          dayPrayers[prayer] = 'Missed';
          missedPrayers++;
          totalPrayers++;
        }
      }
    }

    // Adhkar
    const hasMorningAdhkar = !!morningAdhkar;
    const hasEveningAdhkar = !!eveningAdhkar;
    if (hasMorningAdhkar || hasEveningAdhkar) adhkarDays++;

    // Quran
    const pages = quranLog?.pages || 0;
    const minutes = quranLog?.minutes || 0;
    totalQuranPages += pages;
    totalQuranMinutes += minutes;

    // Charity
    totalCharity += charityForDay;

    // Tahajjud
    const didTahajjud = tahajjudLog?.completed || false;
    if (didTahajjud) tahajjudNights++;

    // Custom habits
    const activeCustomHabits = (habitsState.customHabits || []).filter((h: any) => h.isActive);
    const customLogs = habitsState.customHabitLogs || [];
    let dayCustomCompleted = 0;
    const dayCustomTotal = activeCustomHabits.length;

    activeCustomHabits.forEach((habit: any) => {
      const log = customLogs.find((l: any) => l.habitId === habit.id && l.date === date);
      if (log && (log.count >= habit.targetCount || log.completed)) {
        dayCustomCompleted++;
      }
    });
    totalCustomCompleted += dayCustomCompleted;
    totalCustomHabits += dayCustomTotal;

    days.push({
      date,
      ...dayPrayers,
      adhkarMorning: hasMorningAdhkar,
      adhkarEvening: hasEveningAdhkar,
      quranPages: pages,
      quranMinutes: minutes,
      charityCount: charityForDay,
      tahajjud: didTahajjud,
      customHabitsCompleted: dayCustomCompleted,
      customHabitsTotal: dayCustomTotal,
    });
  }

  return {
    title,
    period,
    days,
    summary: {
      totalPrayers,
      onTimePrayers,
      latePrayers,
      missedPrayers,
      adhkarDays,
      totalQuranPages,
      totalQuranMinutes,
      totalCharity,
      tahajjudNights,
      customHabitsCompleted: totalCustomCompleted,
      customHabitsTotal: totalCustomHabits,
    },
  };
};

// Maintain support for old monthly call signature via wrapper
export const gatherMonthlyData = (
  year: number,
  month: number,
  salatLogs: Record<string, any>,
  habitsState: any,
  locale: string = 'en'
): ReportData => {
  const dates = getMonthDates(year, month);
  const monthName = getMonthName(month, locale);
  return gatherReportData(dates, 'Monthly Report', `${monthName} ${year}`, salatLogs, habitsState);
};

// Generate CSV content
export const generateCSV = (data: ReportData): string => {
  const headers = [
    'Date',
    'Fajr',
    'Dhuhr',
    'Asr',
    'Maghrib',
    'Isha',
    'Morning Adhkar',
    'Evening Adhkar',
    'Quran Pages',
    'Quran Minutes',
    'Charity',
    'Tahajjud',
    'Custom Habits',
  ];

  const rows = data.days.map(day => [
    day.date,
    day.fajr,
    day.dhuhr,
    day.asr,
    day.maghrib,
    day.isha,
    day.adhkarMorning ? 'Yes' : 'No',
    day.adhkarEvening ? 'Yes' : 'No',
    day.quranPages.toString(),
    day.quranMinutes.toString(),
    day.charityCount.toString(),
    day.tahajjud ? 'Yes' : 'No',
    `${day.customHabitsCompleted}/${day.customHabitsTotal}`,
  ]);

  // Add summary row
  rows.push([]);
  rows.push(['Summary']);
  rows.push(['Total Prayers', data.summary.totalPrayers.toString()]);
  rows.push(['On Time', data.summary.onTimePrayers.toString()]);
  rows.push(['Late', data.summary.latePrayers.toString()]);
  rows.push(['Missed', data.summary.missedPrayers.toString()]);
  rows.push(['Adhkar Days', data.summary.adhkarDays.toString()]);
  rows.push(['Quran Pages', data.summary.totalQuranPages.toString()]);
  rows.push(['Charity Acts', data.summary.totalCharity.toString()]);
  rows.push(['Tahajjud Nights', data.summary.tahajjudNights.toString()]);
  rows.push(['Custom Habits', `${data.summary.customHabitsCompleted}/${data.summary.customHabitsTotal}`]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csvContent;
};

// Generate PDF HTML content
export const generatePDFHTML = (data: ReportData): string => {
  const { summary, days, period, title } = data;

  const tableRows = days.map(day => `
    <tr>
      <td>${day.date}</td>
      <td class="${day.fajr === 'On Time' ? 'success' : day.fajr === 'Late' ? 'warning' : day.fajr === 'Missed' ? 'error' : ''}">${day.fajr}</td>
      <td class="${day.dhuhr === 'On Time' ? 'success' : day.dhuhr === 'Late' ? 'warning' : day.dhuhr === 'Missed' ? 'error' : ''}">${day.dhuhr}</td>
      <td class="${day.asr === 'On Time' ? 'success' : day.asr === 'Late' ? 'warning' : day.asr === 'Missed' ? 'error' : ''}">${day.asr}</td>
      <td class="${day.maghrib === 'On Time' ? 'success' : day.maghrib === 'Late' ? 'warning' : day.maghrib === 'Missed' ? 'error' : ''}">${day.maghrib}</td>
      <td class="${day.isha === 'On Time' ? 'success' : day.isha === 'Late' ? 'warning' : day.isha === 'Missed' ? 'error' : ''}">${day.isha}</td>
      <td>${day.adhkarMorning ? 'Y' : '-'}/${day.adhkarEvening ? 'Y' : '-'}</td>
      <td>${day.quranPages}</td>
      <td>${day.charityCount}</td>
      <td>${day.tahajjud ? 'Y' : '-'}</td>
      <td>${day.customHabitsCompleted}/${day.customHabitsTotal}</td>
    </tr>
  `).join('');

  // Prepare data for charts with robust date parsing
  const chartLabels = days.map(d => {
    const parts = d.date.split('-');
    return parts.length === 3 ? parts[2] : d.date;
  });

  const onTimePrayerData = days.map(d => {
    let count = 0;
    if (d.fajr === 'On Time') count++;
    if (d.dhuhr === 'On Time') count++;
    if (d.asr === 'On Time') count++;
    if (d.maghrib === 'On Time') count++;
    if (d.isha === 'On Time') count++;
    return count;
  });
  const adhkarData = days.map(d => (d.adhkarMorning ? 1 : 0) + (d.adhkarEvening ? 1 : 0));
  const quranData = days.map(d => d.quranPages);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title} - ${period}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    @media print {
        @page { margin: 15mm; size: A4; }
        body { padding: 0; -webkit-print-color-adjust: exact; }
        tr { page-break-inside: avoid; }
        thead { display: table-header-group; }
        .chart-box { page-break-inside: avoid; }
        .summary { page-break-inside: avoid; }
        h1, h2 { page-break-after: avoid; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
      color: #1f2937;
    }
    h1 {
      color: #0d9488;
      border-bottom: 2px solid #0d9488;
      padding-bottom: 10px;
      font-size: 24px;
    }
    h2 {
      color: #374151;
      margin-top: 30px;
      margin-bottom: 15px;
      font-size: 18px;
    }
    .summary {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: #f3f4f6;
      border-radius: 10px;
      padding: 15px 20px;
      min-width: 120px;
      flex: 1;
    }
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #0d9488;
    }
    .stat-label {
      font-size: 11px;
      color: #6b7280;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .charts-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        margin-bottom: 30px;
        page-break-inside: avoid;
    }
    .chart-box {
        flex: 1;
        min-width: 300px;
        height: 250px;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 6px 4px;
      text-align: center;
    }
    th {
      background: #0d9488;
      color: white;
      font-weight: 600;
      padding: 8px 4px;
    }
    tr:nth-child(even) {
      background: #f9fafb;
    }
    .success { color: #059669; font-weight: 600; }
    .warning { color: #d97706; }
    .error { color: #dc2626; }
    .footer {
        margin-top: 30px;
        color: #9ca3af;
        font-size: 10px;
        text-align: center;
        border-top: 1px solid #e5e7eb;
        padding-top: 10px;
    }
  </style>
</head>
<body>
  <h1>Ihssan Tracker - ${title}</h1>
  <p style="color: #6b7280; margin-top: -10px; margin-bottom: 20px;">${period}</p>
  
  <div class="summary">
    <div class="stat-card">
      <div class="stat-value">${summary.onTimePrayers}</div>
      <div class="stat-label">On Time Prayers</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${summary.adhkarDays}</div>
      <div class="stat-label">Adhkar Days</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${summary.totalQuranPages}</div>
      <div class="stat-label">Quran Pages</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${summary.totalCharity}</div>
      <div class="stat-label">Charity Acts</div>
    </div>
  </div>

  <h2>Progress Charts</h2>
  <div class="charts-container">
    <div class="chart-box">
        <canvas id="prayersChart"></canvas>
    </div>
    <div class="chart-box">
        <canvas id="habitsChart"></canvas>
    </div>
  </div>
  
  <h2>Daily Breakdown</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Fajr</th>
        <th>Dhuhr</th>
        <th>Asr</th>
        <th>Maghrib</th>
        <th>Isha</th>
        <th>Adhkar</th>
        <th>Quran</th>
        <th>Charity</th>
        <th>Tahajjud</th>
        <th>Custom</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
  
  <div class="footer">
    Generated by Ihssan Tracker
  </div>

  <script>
    const labels = ${JSON.stringify(chartLabels)};
    const prayerData = ${JSON.stringify(onTimePrayerData)};
    const adhkarData = ${JSON.stringify(adhkarData)};
    const quranData = ${JSON.stringify(quranData)};

    new Chart(document.getElementById('prayersChart'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'On Time Prayers',
          data: prayerData,
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 5, ticks: { stepSize: 1 } }
        },
        plugins: {
            title: { display: true, text: 'Daily On-Time Prayers' },
            legend: { display: false }
        }
      }
    });

    new Chart(document.getElementById('habitsChart'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
            {
                label: 'Adhkar (M/E)',
                data: adhkarData,
                backgroundColor: '#059669',
                yAxisID: 'y'
            },
            {
                label: 'Quran Pages',
                data: quranData,
                backgroundColor: '#d97706',
                type: 'line',
                borderColor: '#d97706',
                borderWidth: 2,
                yAxisID: 'y1'
            }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 2, position: 'left', title: { display: true, text: 'Adhkar' } },
          y1: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Pages' } }
        },
        plugins: {
            title: { display: true, text: 'Habits Consistency' }
        }
      }
    });
  </script>
</body>
</html>
  `;
};

// Export to CSV file and share
export const exportCSV = async (data: ReportData): Promise<void> => {
  const csv = generateCSV(data);
  const filename = `ihssan-report-${data.period.replace(/ /g, '-')}.csv`;
  const fileUri = `${FileSystem.documentDirectory}${filename}`;

  await FileSystem.writeAsStringAsync(fileUri, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export Report',
    });
  }
};

// Export to PDF and share
export const exportPDF = async (data: ReportData): Promise<void> => {
  const html = generatePDFHTML(data);

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Export Report',
    });
  }
};
