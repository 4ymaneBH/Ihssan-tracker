// Quran Surah Data - Complete list of 114 surahs
export interface Surah {
    number: number;
    name: string;
    nameArabic: string;
    englishName: string;
    versesCount: number;
    revelationType: 'Makkiyyah' | 'Madaniyyah';
    juz: number[];  // Which juz(s) it spans
}

export const SURAH_LIST: Surah[] = [
    { number: 1, name: 'Al-Fatihah', nameArabic: 'الفاتحة', englishName: 'The Opener', versesCount: 7, revelationType: 'Makkiyyah', juz: [1] },
    { number: 2, name: 'Al-Baqarah', nameArabic: 'البقرة', englishName: 'The Cow', versesCount: 286, revelationType: 'Madaniyyah', juz: [1, 2, 3] },
    { number: 3, name: 'Ali \'Imran', nameArabic: 'آل عمران', englishName: 'Family of Imran', versesCount: 200, revelationType: 'Madaniyyah', juz: [3, 4] },
    { number: 4, name: 'An-Nisa', nameArabic: 'النساء', englishName: 'The Women', versesCount: 176, revelationType: 'Madaniyyah', juz: [4, 5, 6] },
    { number: 5, name: 'Al-Ma\'idah', nameArabic: 'المائدة', englishName: 'The Table Spread', versesCount: 120, revelationType: 'Madaniyyah', juz: [6, 7] },
    { number: 6, name: 'Al-An\'am', nameArabic: 'الأنعام', englishName: 'The Cattle', versesCount: 165, revelationType: 'Makkiyyah', juz: [7, 8] },
    { number: 7, name: 'Al-A\'raf', nameArabic: 'الأعراف', englishName: 'The Heights', versesCount: 206, revelationType: 'Makkiyyah', juz: [8, 9] },
    { number: 8, name: 'Al-Anfal', nameArabic: 'الأنفال', englishName: 'The Spoils of War', versesCount: 75, revelationType: 'Madaniyyah', juz: [9, 10] },
    { number: 9, name: 'At-Tawbah', nameArabic: 'التوبة', englishName: 'The Repentance', versesCount: 129, revelationType: 'Madaniyyah', juz: [10, 11] },
    { number: 10, name: 'Yunus', nameArabic: 'يونس', englishName: 'Jonah', versesCount: 109, revelationType: 'Makkiyyah', juz: [11] },
    { number: 11, name: 'Hud', nameArabic: 'هود', englishName: 'Hud', versesCount: 123, revelationType: 'Makkiyyah', juz: [11, 12] },
    { number: 12, name: 'Yusuf', nameArabic: 'يوسف', englishName: 'Joseph', versesCount: 111, revelationType: 'Makkiyyah', juz: [12, 13] },
    { number: 13, name: 'Ar-Ra\'d', nameArabic: 'الرعد', englishName: 'The Thunder', versesCount: 43, revelationType: 'Madaniyyah', juz: [13] },
    { number: 14, name: 'Ibrahim', nameArabic: 'إبراهيم', englishName: 'Abraham', versesCount: 52, revelationType: 'Makkiyyah', juz: [13] },
    { number: 15, name: 'Al-Hijr', nameArabic: 'الحجر', englishName: 'The Rocky Tract', versesCount: 99, revelationType: 'Makkiyyah', juz: [14] },
    { number: 16, name: 'An-Nahl', nameArabic: 'النحل', englishName: 'The Bee', versesCount: 128, revelationType: 'Makkiyyah', juz: [14] },
    { number: 17, name: 'Al-Isra', nameArabic: 'الإسراء', englishName: 'The Night Journey', versesCount: 111, revelationType: 'Makkiyyah', juz: [15] },
    { number: 18, name: 'Al-Kahf', nameArabic: 'الكهف', englishName: 'The Cave', versesCount: 110, revelationType: 'Makkiyyah', juz: [15, 16] },
    { number: 19, name: 'Maryam', nameArabic: 'مريم', englishName: 'Mary', versesCount: 98, revelationType: 'Makkiyyah', juz: [16] },
    { number: 20, name: 'Taha', nameArabic: 'طه', englishName: 'Ta-Ha', versesCount: 135, revelationType: 'Makkiyyah', juz: [16] },
    { number: 21, name: 'Al-Anbiya', nameArabic: 'الأنبياء', englishName: 'The Prophets', versesCount: 112, revelationType: 'Makkiyyah', juz: [17] },
    { number: 22, name: 'Al-Hajj', nameArabic: 'الحج', englishName: 'The Pilgrimage', versesCount: 78, revelationType: 'Madaniyyah', juz: [17] },
    { number: 23, name: 'Al-Mu\'minun', nameArabic: 'المؤمنون', englishName: 'The Believers', versesCount: 118, revelationType: 'Makkiyyah', juz: [18] },
    { number: 24, name: 'An-Nur', nameArabic: 'النور', englishName: 'The Light', versesCount: 64, revelationType: 'Madaniyyah', juz: [18] },
    { number: 25, name: 'Al-Furqan', nameArabic: 'الفرقان', englishName: 'The Criterion', versesCount: 77, revelationType: 'Makkiyyah', juz: [18, 19] },
    { number: 26, name: 'Ash-Shu\'ara', nameArabic: 'الشعراء', englishName: 'The Poets', versesCount: 227, revelationType: 'Makkiyyah', juz: [19] },
    { number: 27, name: 'An-Naml', nameArabic: 'النمل', englishName: 'The Ant', versesCount: 93, revelationType: 'Makkiyyah', juz: [19, 20] },
    { number: 28, name: 'Al-Qasas', nameArabic: 'القصص', englishName: 'The Stories', versesCount: 88, revelationType: 'Makkiyyah', juz: [20] },
    { number: 29, name: 'Al-Ankabut', nameArabic: 'العنكبوت', englishName: 'The Spider', versesCount: 69, revelationType: 'Makkiyyah', juz: [20, 21] },
    { number: 30, name: 'Ar-Rum', nameArabic: 'الروم', englishName: 'The Romans', versesCount: 60, revelationType: 'Makkiyyah', juz: [21] },
    { number: 31, name: 'Luqman', nameArabic: 'لقمان', englishName: 'Luqman', versesCount: 34, revelationType: 'Makkiyyah', juz: [21] },
    { number: 32, name: 'As-Sajdah', nameArabic: 'السجدة', englishName: 'The Prostration', versesCount: 30, revelationType: 'Makkiyyah', juz: [21] },
    { number: 33, name: 'Al-Ahzab', nameArabic: 'الأحزاب', englishName: 'The Combined Forces', versesCount: 73, revelationType: 'Madaniyyah', juz: [21, 22] },
    { number: 34, name: 'Saba', nameArabic: 'سبأ', englishName: 'Sheba', versesCount: 54, revelationType: 'Makkiyyah', juz: [22] },
    { number: 35, name: 'Fatir', nameArabic: 'فاطر', englishName: 'Originator', versesCount: 45, revelationType: 'Makkiyyah', juz: [22] },
    { number: 36, name: 'Ya-Sin', nameArabic: 'يس', englishName: 'Ya Sin', versesCount: 83, revelationType: 'Makkiyyah', juz: [22, 23] },
    { number: 37, name: 'As-Saffat', nameArabic: 'الصافات', englishName: 'Those who set the Ranks', versesCount: 182, revelationType: 'Makkiyyah', juz: [23] },
    { number: 38, name: 'Sad', nameArabic: 'ص', englishName: 'The Letter Sad', versesCount: 88, revelationType: 'Makkiyyah', juz: [23] },
    { number: 39, name: 'Az-Zumar', nameArabic: 'الزمر', englishName: 'The Troops', versesCount: 75, revelationType: 'Makkiyyah', juz: [23, 24] },
    { number: 40, name: 'Ghafir', nameArabic: 'غافر', englishName: 'The Forgiver', versesCount: 85, revelationType: 'Makkiyyah', juz: [24] },
    { number: 41, name: 'Fussilat', nameArabic: 'فصلت', englishName: 'Explained in Detail', versesCount: 54, revelationType: 'Makkiyyah', juz: [24, 25] },
    { number: 42, name: 'Ash-Shuraa', nameArabic: 'الشورى', englishName: 'The Consultation', versesCount: 53, revelationType: 'Makkiyyah', juz: [25] },
    { number: 43, name: 'Az-Zukhruf', nameArabic: 'الزخرف', englishName: 'The Ornaments of Gold', versesCount: 89, revelationType: 'Makkiyyah', juz: [25] },
    { number: 44, name: 'Ad-Dukhan', nameArabic: 'الدخان', englishName: 'The Smoke', versesCount: 59, revelationType: 'Makkiyyah', juz: [25] },
    { number: 45, name: 'Al-Jathiyah', nameArabic: 'الجاثية', englishName: 'The Crouching', versesCount: 37, revelationType: 'Makkiyyah', juz: [25] },
    { number: 46, name: 'Al-Ahqaf', nameArabic: 'الأحقاف', englishName: 'The Wind-Curved Sandhills', versesCount: 35, revelationType: 'Makkiyyah', juz: [26] },
    { number: 47, name: 'Muhammad', nameArabic: 'محمد', englishName: 'Muhammad', versesCount: 38, revelationType: 'Madaniyyah', juz: [26] },
    { number: 48, name: 'Al-Fath', nameArabic: 'الفتح', englishName: 'The Victory', versesCount: 29, revelationType: 'Madaniyyah', juz: [26] },
    { number: 49, name: 'Al-Hujurat', nameArabic: 'الحجرات', englishName: 'The Rooms', versesCount: 18, revelationType: 'Madaniyyah', juz: [26] },
    { number: 50, name: 'Qaf', nameArabic: 'ق', englishName: 'The Letter Qaf', versesCount: 45, revelationType: 'Makkiyyah', juz: [26] },
    { number: 51, name: 'Adh-Dhariyat', nameArabic: 'الذاريات', englishName: 'The Winnowing Winds', versesCount: 60, revelationType: 'Makkiyyah', juz: [26, 27] },
    { number: 52, name: 'At-Tur', nameArabic: 'الطور', englishName: 'The Mount', versesCount: 49, revelationType: 'Makkiyyah', juz: [27] },
    { number: 53, name: 'An-Najm', nameArabic: 'النجم', englishName: 'The Star', versesCount: 62, revelationType: 'Makkiyyah', juz: [27] },
    { number: 54, name: 'Al-Qamar', nameArabic: 'القمر', englishName: 'The Moon', versesCount: 55, revelationType: 'Makkiyyah', juz: [27] },
    { number: 55, name: 'Ar-Rahman', nameArabic: 'الرحمن', englishName: 'The Beneficent', versesCount: 78, revelationType: 'Madaniyyah', juz: [27] },
    { number: 56, name: 'Al-Waqi\'ah', nameArabic: 'الواقعة', englishName: 'The Inevitable', versesCount: 96, revelationType: 'Makkiyyah', juz: [27] },
    { number: 57, name: 'Al-Hadid', nameArabic: 'الحديد', englishName: 'The Iron', versesCount: 29, revelationType: 'Madaniyyah', juz: [27] },
    { number: 58, name: 'Al-Mujadila', nameArabic: 'المجادلة', englishName: 'The Pleading Woman', versesCount: 22, revelationType: 'Madaniyyah', juz: [28] },
    { number: 59, name: 'Al-Hashr', nameArabic: 'الحشر', englishName: 'The Exile', versesCount: 24, revelationType: 'Madaniyyah', juz: [28] },
    { number: 60, name: 'Al-Mumtahanah', nameArabic: 'الممتحنة', englishName: 'She that is to be examined', versesCount: 13, revelationType: 'Madaniyyah', juz: [28] },
    { number: 61, name: 'As-Saf', nameArabic: 'الصف', englishName: 'The Ranks', versesCount: 14, revelationType: 'Madaniyyah', juz: [28] },
    { number: 62, name: 'Al-Jumu\'ah', nameArabic: 'الجمعة', englishName: 'Friday', versesCount: 11, revelationType: 'Madaniyyah', juz: [28] },
    { number: 63, name: 'Al-Munafiqun', nameArabic: 'المنافقون', englishName: 'The Hypocrites', versesCount: 11, revelationType: 'Madaniyyah', juz: [28] },
    { number: 64, name: 'At-Taghabun', nameArabic: 'التغابن', englishName: 'The Mutual Disillusion', versesCount: 18, revelationType: 'Madaniyyah', juz: [28] },
    { number: 65, name: 'At-Talaq', nameArabic: 'الطلاق', englishName: 'The Divorce', versesCount: 12, revelationType: 'Madaniyyah', juz: [28] },
    { number: 66, name: 'At-Tahrim', nameArabic: 'التحريم', englishName: 'The Prohibition', versesCount: 12, revelationType: 'Madaniyyah', juz: [28] },
    { number: 67, name: 'Al-Mulk', nameArabic: 'الملك', englishName: 'The Sovereignty', versesCount: 30, revelationType: 'Makkiyyah', juz: [29] },
    { number: 68, name: 'Al-Qalam', nameArabic: 'القلم', englishName: 'The Pen', versesCount: 52, revelationType: 'Makkiyyah', juz: [29] },
    { number: 69, name: 'Al-Haqqah', nameArabic: 'الحاقة', englishName: 'The Reality', versesCount: 52, revelationType: 'Makkiyyah', juz: [29] },
    { number: 70, name: 'Al-Ma\'arij', nameArabic: 'المعارج', englishName: 'The Ascending Stairways', versesCount: 44, revelationType: 'Makkiyyah', juz: [29] },
    { number: 71, name: 'Nuh', nameArabic: 'نوح', englishName: 'Noah', versesCount: 28, revelationType: 'Makkiyyah', juz: [29] },
    { number: 72, name: 'Al-Jinn', nameArabic: 'الجن', englishName: 'The Jinn', versesCount: 28, revelationType: 'Makkiyyah', juz: [29] },
    { number: 73, name: 'Al-Muzzammil', nameArabic: 'المزمل', englishName: 'The Enshrouded One', versesCount: 20, revelationType: 'Makkiyyah', juz: [29] },
    { number: 74, name: 'Al-Muddaththir', nameArabic: 'المدثر', englishName: 'The Cloaked One', versesCount: 56, revelationType: 'Makkiyyah', juz: [29] },
    { number: 75, name: 'Al-Qiyamah', nameArabic: 'القيامة', englishName: 'The Resurrection', versesCount: 40, revelationType: 'Makkiyyah', juz: [29] },
    { number: 76, name: 'Al-Insan', nameArabic: 'الإنسان', englishName: 'The Man', versesCount: 31, revelationType: 'Madaniyyah', juz: [29] },
    { number: 77, name: 'Al-Mursalat', nameArabic: 'المرسلات', englishName: 'The Emissaries', versesCount: 50, revelationType: 'Makkiyyah', juz: [29] },
    { number: 78, name: 'An-Naba', nameArabic: 'النبأ', englishName: 'The Tidings', versesCount: 40, revelationType: 'Makkiyyah', juz: [30] },
    { number: 79, name: 'An-Nazi\'at', nameArabic: 'النازعات', englishName: 'Those who drag forth', versesCount: 46, revelationType: 'Makkiyyah', juz: [30] },
    { number: 80, name: 'Abasa', nameArabic: 'عبس', englishName: 'He Frowned', versesCount: 42, revelationType: 'Makkiyyah', juz: [30] },
    { number: 81, name: 'At-Takwir', nameArabic: 'التكوير', englishName: 'The Overthrowing', versesCount: 29, revelationType: 'Makkiyyah', juz: [30] },
    { number: 82, name: 'Al-Infitar', nameArabic: 'الانفطار', englishName: 'The Cleaving', versesCount: 19, revelationType: 'Makkiyyah', juz: [30] },
    { number: 83, name: 'Al-Mutaffifin', nameArabic: 'المطففين', englishName: 'The Defrauding', versesCount: 36, revelationType: 'Makkiyyah', juz: [30] },
    { number: 84, name: 'Al-Inshiqaq', nameArabic: 'الانشقاق', englishName: 'The Sundering', versesCount: 25, revelationType: 'Makkiyyah', juz: [30] },
    { number: 85, name: 'Al-Buruj', nameArabic: 'البروج', englishName: 'The Mansions of the Stars', versesCount: 22, revelationType: 'Makkiyyah', juz: [30] },
    { number: 86, name: 'At-Tariq', nameArabic: 'الطارق', englishName: 'The Nightcomer', versesCount: 17, revelationType: 'Makkiyyah', juz: [30] },
    { number: 87, name: 'Al-A\'la', nameArabic: 'الأعلى', englishName: 'The Most High', versesCount: 19, revelationType: 'Makkiyyah', juz: [30] },
    { number: 88, name: 'Al-Ghashiyah', nameArabic: 'الغاشية', englishName: 'The Overwhelming', versesCount: 26, revelationType: 'Makkiyyah', juz: [30] },
    { number: 89, name: 'Al-Fajr', nameArabic: 'الفجر', englishName: 'The Dawn', versesCount: 30, revelationType: 'Makkiyyah', juz: [30] },
    { number: 90, name: 'Al-Balad', nameArabic: 'البلد', englishName: 'The City', versesCount: 20, revelationType: 'Makkiyyah', juz: [30] },
    { number: 91, name: 'Ash-Shams', nameArabic: 'الشمس', englishName: 'The Sun', versesCount: 15, revelationType: 'Makkiyyah', juz: [30] },
    { number: 92, name: 'Al-Layl', nameArabic: 'الليل', englishName: 'The Night', versesCount: 21, revelationType: 'Makkiyyah', juz: [30] },
    { number: 93, name: 'Ad-Duhaa', nameArabic: 'الضحى', englishName: 'The Morning Hours', versesCount: 11, revelationType: 'Makkiyyah', juz: [30] },
    { number: 94, name: 'Ash-Sharh', nameArabic: 'الشرح', englishName: 'The Relief', versesCount: 8, revelationType: 'Makkiyyah', juz: [30] },
    { number: 95, name: 'At-Tin', nameArabic: 'التين', englishName: 'The Fig', versesCount: 8, revelationType: 'Makkiyyah', juz: [30] },
    { number: 96, name: 'Al-Alaq', nameArabic: 'العلق', englishName: 'The Clot', versesCount: 19, revelationType: 'Makkiyyah', juz: [30] },
    { number: 97, name: 'Al-Qadr', nameArabic: 'القدر', englishName: 'The Power', versesCount: 5, revelationType: 'Makkiyyah', juz: [30] },
    { number: 98, name: 'Al-Bayyinah', nameArabic: 'البينة', englishName: 'The Clear Proof', versesCount: 8, revelationType: 'Madaniyyah', juz: [30] },
    { number: 99, name: 'Az-Zalzalah', nameArabic: 'الزلزلة', englishName: 'The Earthquake', versesCount: 8, revelationType: 'Madaniyyah', juz: [30] },
    { number: 100, name: 'Al-Adiyat', nameArabic: 'العاديات', englishName: 'The Courser', versesCount: 11, revelationType: 'Makkiyyah', juz: [30] },
    { number: 101, name: 'Al-Qari\'ah', nameArabic: 'القارعة', englishName: 'The Calamity', versesCount: 11, revelationType: 'Makkiyyah', juz: [30] },
    { number: 102, name: 'At-Takathur', nameArabic: 'التكاثر', englishName: 'The Rivalry in world increase', versesCount: 8, revelationType: 'Makkiyyah', juz: [30] },
    { number: 103, name: 'Al-Asr', nameArabic: 'العصر', englishName: 'The Declining Day', versesCount: 3, revelationType: 'Makkiyyah', juz: [30] },
    { number: 104, name: 'Al-Humazah', nameArabic: 'الهمزة', englishName: 'The Traducer', versesCount: 9, revelationType: 'Makkiyyah', juz: [30] },
    { number: 105, name: 'Al-Fil', nameArabic: 'الفيل', englishName: 'The Elephant', versesCount: 5, revelationType: 'Makkiyyah', juz: [30] },
    { number: 106, name: 'Quraysh', nameArabic: 'قريش', englishName: 'Quraysh', versesCount: 4, revelationType: 'Makkiyyah', juz: [30] },
    { number: 107, name: 'Al-Ma\'un', nameArabic: 'الماعون', englishName: 'The Small Kindnesses', versesCount: 7, revelationType: 'Makkiyyah', juz: [30] },
    { number: 108, name: 'Al-Kawthar', nameArabic: 'الكوثر', englishName: 'The Abundance', versesCount: 3, revelationType: 'Makkiyyah', juz: [30] },
    { number: 109, name: 'Al-Kafirun', nameArabic: 'الكافرون', englishName: 'The Disbelievers', versesCount: 6, revelationType: 'Makkiyyah', juz: [30] },
    { number: 110, name: 'An-Nasr', nameArabic: 'النصر', englishName: 'The Divine Support', versesCount: 3, revelationType: 'Madaniyyah', juz: [30] },
    { number: 111, name: 'Al-Masad', nameArabic: 'المسد', englishName: 'The Palm Fiber', versesCount: 5, revelationType: 'Makkiyyah', juz: [30] },
    { number: 112, name: 'Al-Ikhlas', nameArabic: 'الإخلاص', englishName: 'The Sincerity', versesCount: 4, revelationType: 'Makkiyyah', juz: [30] },
    { number: 113, name: 'Al-Falaq', nameArabic: 'الفلق', englishName: 'The Daybreak', versesCount: 5, revelationType: 'Makkiyyah', juz: [30] },
    { number: 114, name: 'An-Nas', nameArabic: 'الناس', englishName: 'Mankind', versesCount: 6, revelationType: 'Makkiyyah', juz: [30] },
];

// Color for surah number badge based on position  
export const getSurahBadgeColor = (number: number): string => {
    const colors = [
        '#0EA571', // Teal-green
        '#38BDF8', // Blue 
        '#F59E0B', // Amber
        '#A78BFA', // Purple
        '#FB7185', // Pink
        '#34D399', // Emerald
        '#60A5FA', // Blue-400
        '#FBBF24', // Yellow
        '#C084FC', // Purple-400
        '#F472B6', // Pink-400
    ];
    return colors[(number - 1) % colors.length];
};
