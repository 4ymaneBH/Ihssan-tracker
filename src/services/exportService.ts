// Export Service - Monthly analytics export to CSV and PDF
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
}

export interface MonthlyData {
    year: number;
    month: number;
    monthName: string;
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
    };
}

// Get all dates in a month
export const getMonthDates = (year: number, month: number): string[] => {
    const dates: string[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        dates.push(getDateString(date));
    }

    return dates;
};

// Get month name
export const getMonthName = (month: number, locale: string = 'en'): string => {
    const date = new Date(2024, month, 1);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { month: 'long' });
};

// Gather all monthly data from stores
export const gatherMonthlyData = (
    year: number,
    month: number,
    salatLogs: Record<string, any>,
    habitsState: {
        adhkarLogs: Record<string, any>;
        quranLogs: Record<string, any>;
        charityLogs: any[];
        tahajjudLogs: Record<string, any>;
    },
    locale: string = 'en'
): MonthlyData => {
    const dates = getMonthDates(year, month);
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

        days.push({
            date,
            ...dayPrayers,
            adhkarMorning: hasMorningAdhkar,
            adhkarEvening: hasEveningAdhkar,
            quranPages: pages,
            quranMinutes: minutes,
            charityCount: charityForDay,
            tahajjud: didTahajjud,
        });
    }

    return {
        year,
        month,
        monthName: getMonthName(month, locale),
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
        },
    };
};

// Generate CSV content
export const generateCSV = (data: MonthlyData): string => {
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

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
    ].join('\n');

    return csvContent;
};

// Generate PDF HTML content
export const generatePDFHTML = (data: MonthlyData): string => {
    const { summary, days, monthName, year } = data;

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
    </tr>
  `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Monthly Report - ${monthName} ${year}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
      color: #1f2937;
    }
    h1 {
      color: #0d9488;
      border-bottom: 2px solid #0d9488;
      padding-bottom: 10px;
    }
    h2 {
      color: #374151;
      margin-top: 30px;
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
    }
    .stat-value {
      font-size: 28px;
      font-weight: bold;
      color: #0d9488;
    }
    .stat-label {
      font-size: 12px;
      color: #6b7280;
      margin-top: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 8px 6px;
      text-align: center;
    }
    th {
      background: #0d9488;
      color: white;
      font-weight: 600;
    }
    tr:nth-child(even) {
      background: #f9fafb;
    }
    .success { color: #059669; font-weight: 600; }
    .warning { color: #d97706; }
    .error { color: #dc2626; }
  </style>
</head>
<body>
  <h1>Ihssan Tracker - Monthly Report</h1>
  <h2>${monthName} ${year}</h2>
  
  <div class="summary">
    <div class="stat-card">
      <div class="stat-value">${summary.onTimePrayers}</div>
      <div class="stat-label">On Time Prayers</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${summary.latePrayers}</div>
      <div class="stat-label">Late Prayers</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${summary.missedPrayers}</div>
      <div class="stat-label">Missed Prayers</div>
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
    <div class="stat-card">
      <div class="stat-value">${summary.tahajjudNights}</div>
      <div class="stat-label">Tahajjud Nights</div>
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
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
  
  <p style="margin-top: 30px; color: #9ca3af; font-size: 11px; text-align: center;">
    Generated by Ihssan Tracker
  </p>
</body>
</html>
  `;
};

// Export to CSV file and share
export const exportCSV = async (data: MonthlyData): Promise<void> => {
    const csv = generateCSV(data);
    const filename = `ihssan-report-${data.year}-${String(data.month + 1).padStart(2, '0')}.csv`;
    const fileUri = `${FileSystem.documentDirectory}${filename}`;

    await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
            mimeType: 'text/csv',
            dialogTitle: 'Export Monthly Report',
        });
    }
};

// Export to PDF and share
export const exportPDF = async (data: MonthlyData): Promise<void> => {
    const html = generatePDFHTML(data);

    const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
    });

    // Share directly - no need to rename
    if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Export Monthly Report',
        });
    }
};
