// Adhkar Content Data - Morning, Evening, and General Adhkar
// Each adhkar has Arabic text, transliteration, translation, and repeat count

export interface Dhikr {
    id: string;
    arabic: string;
    transliteration: string;
    translation: string;
    repeatCount: number;
    category: 'morning' | 'evening' | 'general' | 'both';
    reference?: string;
}

// Morning Adhkar (أذكار الصباح)
export const morningAdhkar: Dhikr[] = [
    {
        id: 'morning-1',
        arabic: 'أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\n﴿اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ﴾',
        transliteration: 'A\'udhu billahi minash-shaytanir-rajim. Allahu la ilaha illa Huwal-Hayyul-Qayyum...',
        translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep...',
        repeatCount: 1,
        category: 'both',
        reference: 'Ayat al-Kursi (Al-Baqarah 2:255)',
    },
    {
        id: 'morning-2',
        arabic: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ\n﴿قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ﴾',
        transliteration: 'Bismillahir-Rahmanir-Rahim. Qul Huwa Allahu Ahad. Allahus-Samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.',
        translation: 'Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born. Nor is there to Him any equivalent.',
        repeatCount: 3,
        category: 'both',
        reference: 'Surah Al-Ikhlas',
    },
    {
        id: 'morning-3',
        arabic: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ\n﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ﴾',
        transliteration: 'Bismillahir-Rahmanir-Rahim. Qul a\'udhu bi Rabbil-falaq. Min sharri ma khalaq...',
        translation: 'Say: I seek refuge in the Lord of daybreak. From the evil of that which He created...',
        repeatCount: 3,
        category: 'both',
        reference: 'Surah Al-Falaq',
    },
    {
        id: 'morning-4',
        arabic: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ\n﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ﴾',
        transliteration: 'Bismillahir-Rahmanir-Rahim. Qul a\'udhu bi Rabbin-nas. Malikin-nas. Ilahin-nas...',
        translation: 'Say: I seek refuge in the Lord of mankind. The Sovereign of mankind. The God of mankind...',
        repeatCount: 3,
        category: 'both',
        reference: 'Surah An-Nas',
    },
    {
        id: 'morning-5',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: 'Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah...',
        translation: 'We have entered the morning and the dominion belongs to Allah. Praise is to Allah. None has the right to be worshipped except Allah alone...',
        repeatCount: 1,
        category: 'morning',
        reference: 'Abu Dawud',
    },
    {
        id: 'morning-6',
        arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
        transliteration: 'Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namut, wa ilaykan-nushur.',
        translation: 'O Allah, by Your grace we enter the morning, and by Your grace we enter the evening. By Your grace we live, and by Your grace we die, and to You is the resurrection.',
        repeatCount: 1,
        category: 'morning',
        reference: 'At-Tirmidhi',
    },
    {
        id: 'morning-7',
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
        transliteration: 'Allahumma Anta Rabbi, la ilaha illa Ant, khalaqtani wa ana \'abduk, wa ana \'ala \'ahdika wa wa\'dika mastata\'t...',
        translation: 'O Allah, You are my Lord. There is no deity except You. You created me, and I am Your servant. I abide by Your covenant and promise as best I can...',
        repeatCount: 1,
        category: 'morning',
        reference: 'Sayyid al-Istighfar - Bukhari',
    },
    {
        id: 'morning-8',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ',
        transliteration: 'Allahumma inni as\'alukal-\'afiyah fid-dunya wal-akhirah.',
        translation: 'O Allah, I ask You for well-being in this world and the Hereafter.',
        repeatCount: 1,
        category: 'morning',
        reference: 'Ibn Majah',
    },
    {
        id: 'morning-9',
        arabic: 'بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        transliteration: 'Bismillahil-ladhi la yadurru ma\'asmihi shay\'un fil-ardi wa la fis-sama\'i, wa Huwas-Sami\'ul-\'Alim.',
        translation: 'In the name of Allah, with Whose name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.',
        repeatCount: 3,
        category: 'both',
        reference: 'At-Tirmidhi',
    },
    {
        id: 'morning-10',
        arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ',
        transliteration: 'SubhanAllahi wa bihamdih.',
        translation: 'Glory is to Allah and praise is to Him.',
        repeatCount: 100,
        category: 'both',
        reference: 'Muslim',
    },
    {
        id: 'morning-11',
        arabic: 'لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: 'La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa \'ala kulli shay\'in Qadir.',
        translation: 'None has the right to be worshipped except Allah alone, with no partner. To Him belongs the dominion and to Him is the praise, and He is Able to do all things.',
        repeatCount: 10,
        category: 'both',
        reference: 'Bukhari & Muslim',
    },
    {
        id: 'morning-12',
        arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
        transliteration: 'Allahumma salli wa sallim \'ala nabiyyina Muhammad.',
        translation: 'O Allah, send prayers and peace upon our Prophet Muhammad.',
        repeatCount: 10,
        category: 'both',
        reference: 'At-Tirmidhi',
    },
    {
        id: 'morning-13',
        arabic: 'رَضِيتُ بِاللهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
        transliteration: 'Raditu billahi Rabba, wa bil-Islami dina, wa bi-Muhammadin sallallahu \'alayhi wa sallama nabiyya.',
        translation: 'I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad (peace be upon him) as my Prophet.',
        repeatCount: 3,
        category: 'morning',
        reference: 'Abu Dawud',
    },
    {
        id: 'morning-14',
        arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
        transliteration: 'Ya Hayyu Ya Qayyum, bi-rahmatika astaghith, aslih li sha\'ni kullahu, wa la takilni ila nafsi tarfata \'ayn.',
        translation: 'O Ever-Living, O Sustainer, by Your mercy I seek help. Rectify all my affairs and do not leave me to myself even for the blink of an eye.',
        repeatCount: 3,
        category: 'morning',
        reference: 'An-Nasa\'i',
    },
];

// Evening Adhkar (أذكار المساء)
export const eveningAdhkar: Dhikr[] = [
    ...morningAdhkar.filter(d => d.category === 'both'),
    {
        id: 'evening-1',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ',
        transliteration: 'Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah...',
        translation: 'We have entered the evening and the dominion belongs to Allah. Praise is to Allah. None has the right to be worshipped except Allah alone...',
        repeatCount: 1,
        category: 'evening',
        reference: 'Abu Dawud',
    },
    {
        id: 'evening-2',
        arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
        transliteration: 'Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namut, wa ilaykal-masir.',
        translation: 'O Allah, by Your grace we enter the evening, and by Your grace we enter the morning. By Your grace we live, and by Your grace we die, and to You is the final return.',
        repeatCount: 1,
        category: 'evening',
        reference: 'At-Tirmidhi',
    },
    {
        id: 'evening-3',
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        transliteration: 'A\'udhu bikalimati Allahit-tammati min sharri ma khalaq.',
        translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
        repeatCount: 3,
        category: 'evening',
        reference: 'Muslim',
    },
    {
        id: 'evening-4',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
        transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazan, wa a\'udhu bika minal-\'ajzi wal-kasal.',
        translation: 'O Allah, I seek refuge in You from worry and grief, and I seek refuge in You from incapacity and laziness.',
        repeatCount: 1,
        category: 'evening',
        reference: 'Bukhari',
    },
    {
        id: 'evening-5',
        arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي',
        transliteration: 'Allahumma \'afini fi badani, Allahumma \'afini fi sam\'i, Allahumma \'afini fi basari.',
        translation: 'O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight.',
        repeatCount: 3,
        category: 'evening',
        reference: 'Abu Dawud',
    },
];

// General Adhkar (أذكار عامة)
export const generalAdhkar: Dhikr[] = [
    {
        id: 'general-1',
        arabic: 'سُبْحَانَ اللهِ',
        transliteration: 'SubhanAllah',
        translation: 'Glory be to Allah.',
        repeatCount: 33,
        category: 'general',
        reference: 'General Tasbih',
    },
    {
        id: 'general-2',
        arabic: 'الْحَمْدُ لِلَّهِ',
        transliteration: 'Alhamdulillah',
        translation: 'All praise is due to Allah.',
        repeatCount: 33,
        category: 'general',
        reference: 'General Tahmid',
    },
    {
        id: 'general-3',
        arabic: 'اللهُ أَكْبَرُ',
        transliteration: 'Allahu Akbar',
        translation: 'Allah is the Greatest.',
        repeatCount: 34,
        category: 'general',
        reference: 'General Takbir',
    },
    {
        id: 'general-4',
        arabic: 'أَسْتَغْفِرُ اللهَ',
        transliteration: 'Astaghfirullah',
        translation: 'I seek forgiveness from Allah.',
        repeatCount: 100,
        category: 'general',
        reference: 'Istighfar',
    },
    {
        id: 'general-5',
        arabic: 'لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللهِ',
        transliteration: 'La hawla wa la quwwata illa billah',
        translation: 'There is no might nor power except with Allah.',
        repeatCount: 10,
        category: 'general',
        reference: 'Hawqala - Bukhari',
    },
    {
        id: 'general-6',
        arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ، سُبْحَانَ اللهِ الْعَظِيمِ',
        transliteration: 'SubhanAllahi wa bihamdih, SubhanAllahil-\'Azim',
        translation: 'Glory be to Allah and praise Him. Glory be to Allah, the Most Great.',
        repeatCount: 10,
        category: 'general',
        reference: 'Bukhari & Muslim',
    },
    {
        id: 'general-7',
        arabic: 'اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاهْدِنِي وَعَافِنِي وَارْزُقْنِي',
        transliteration: 'Allahumma-ghfir li, warhamni, wahdini, wa \'afini, warzuqni',
        translation: 'O Allah, forgive me, have mercy on me, guide me, give me health, and provide for me.',
        repeatCount: 7,
        category: 'general',
        reference: 'Muslim',
    },
    {
        id: 'general-8',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الشِّرْكِ وَالْكُفْرِ',
        transliteration: 'Allahumma inni a\'udhu bika minash-shirki wal-kufr',
        translation: 'O Allah, I seek refuge in You from associating partners with You and from disbelief.',
        repeatCount: 3,
        category: 'general',
        reference: 'Al-Hakim',
    },
    {
        id: 'general-9',
        arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
        transliteration: 'Rabbi-ghfir li wa tub \'alayy, innaka Antat-Tawwabur-Rahim',
        translation: 'My Lord, forgive me and accept my repentance. Indeed, You are the Accepting of Repentance, the Merciful.',
        repeatCount: 100,
        category: 'general',
        reference: 'At-Tirmidhi',
    },
    {
        id: 'general-10',
        arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
        transliteration: 'Allahumma a\'inni \'ala dhikrika wa shukrika wa husni \'ibadatik',
        translation: 'O Allah, help me to remember You, to thank You, and to worship You in the best manner.',
        repeatCount: 1,
        category: 'general',
        reference: 'Abu Dawud',
    },
];

// Get adhkar by category - updated to support 'general'
export const getAdhkarByCategory = (category: 'morning' | 'evening' | 'general'): Dhikr[] => {
    if (category === 'morning') return morningAdhkar;
    if (category === 'evening') return eveningAdhkar;
    return generalAdhkar;
};

// Get total adhkar count for a category
export const getAdhkarCount = (category: 'morning' | 'evening' | 'general'): number => {
    return getAdhkarByCategory(category).length;
};

// Get all categories
export const adhkarCategories = ['morning', 'evening', 'general'] as const;
export type AdhkarCategory = typeof adhkarCategories[number];
