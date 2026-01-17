// Adhkar Content Data - Morning and Evening Adhkar
// Each adhkar has Arabic text, transliteration, translation, and repeat count

export interface Dhikr {
    id: string;
    arabic: string;
    transliteration: string;
    translation: string;
    repeatCount: number;
    category: 'morning' | 'evening' | 'both';
    reference?: string;
}

// Morning Adhkar (أذكار الصباح)
export const morningAdhkar: Dhikr[] = [
    {
        id: 'morning-1',
        arabic: 'أَعُوذُ بِاللهِ مِنَ الشَّيْطَانِ الرَّجِيمِ\n﴿اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ﴾',
        transliteration: 'A\'udhu billahi minash-shaytanir-rajim. Allahu la ilaha illa Huwal-Hayyul-Qayyum...',
        translation: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth...',
        repeatCount: 1,
        category: 'both',
        reference: 'Ayat al-Kursi (Al-Baqarah 2:255)',
    },
    {
        id: 'morning-2',
        arabic: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ\n﴿قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ﴾',
        transliteration: 'Bismillahir-Rahmanir-Rahim. Qul Huwa Allahu Ahad. Allahus-Samad. Lam yalid wa lam yulad. Wa lam yakun lahu kufuwan ahad.',
        translation: 'In the name of Allah, the Most Gracious, the Most Merciful. Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born. Nor is there to Him any equivalent.',
        repeatCount: 3,
        category: 'both',
        reference: 'Surah Al-Ikhlas',
    },
    {
        id: 'morning-3',
        arabic: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ\n﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ ۝ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۝ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ ۝ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ﴾',
        transliteration: 'Bismillahir-Rahmanir-Rahim. Qul a\'udhu bi Rabbil-falaq. Min sharri ma khalaq. Wa min sharri ghasiqin idha waqab. Wa min sharrin-naffathati fil-\'uqad. Wa min sharri hasidin idha hasad.',
        translation: 'In the name of Allah, the Most Gracious, the Most Merciful. Say: I seek refuge in the Lord of daybreak. From the evil of that which He created. And from the evil of darkness when it settles. And from the evil of the blowers in knots. And from the evil of an envier when he envies.',
        repeatCount: 3,
        category: 'both',
        reference: 'Surah Al-Falaq',
    },
    {
        id: 'morning-4',
        arabic: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ\n﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ۝ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ۝ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ۝ مِنَ الْجِنَّةِ وَالنَّاسِ﴾',
        transliteration: 'Bismillahir-Rahmanir-Rahim. Qul a\'udhu bi Rabbin-nas. Malikin-nas. Ilahin-nas. Min sharril-waswasil-khannas. Alladhi yuwaswisu fi sudurin-nas. Minal-jinnati wannas.',
        translation: 'In the name of Allah, the Most Gracious, the Most Merciful. Say: I seek refuge in the Lord of mankind. The Sovereign of mankind. The God of mankind. From the evil of the retreating whisperer. Who whispers in the breasts of mankind. From among the jinn and mankind.',
        repeatCount: 3,
        category: 'both',
        reference: 'Surah An-Nas',
    },
    {
        id: 'morning-5',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: 'Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa \'ala kulli shay\'in Qadir.',
        translation: 'We have entered the morning and the dominion belongs to Allah. Praise is to Allah. None has the right to be worshipped except Allah alone, with no partner. To Him belongs the dominion and to Him is the praise, and He is Able to do all things.',
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
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ',
        transliteration: 'Allahumma Anta Rabbi, la ilaha illa Ant, khalaqtani wa ana \'abduk, wa ana \'ala \'ahdika wa wa\'dika mastata\'t, a\'udhu bika min sharri ma sana\'t, abu\'u laka bini\'matika \'alayya, wa abu\'u bidhanbi faghfir li, fa innahu la yaghfirudh-dhunuba illa Ant.',
        translation: 'O Allah, You are my Lord. There is no deity except You. You created me, and I am Your servant. I abide by Your covenant and promise as best I can. I seek refuge in You from the evil I have done. I acknowledge Your blessings upon me, and I admit my sins. So forgive me, for none forgives sins except You.',
        repeatCount: 1,
        category: 'morning',
        reference: 'Sayyid al-Istighfar - Bukhari',
    },
    {
        id: 'morning-8',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي',
        transliteration: 'Allahumma inni as\'alukal-\'afiyah fid-dunya wal-akhirah. Allahumma inni as\'alukal-\'afwa wal-\'afiyah fi dini wa dunyaya wa ahli wa mali.',
        translation: 'O Allah, I ask You for well-being in this world and the Hereafter. O Allah, I ask You for pardon and well-being in my religion, my worldly affairs, my family and my wealth.',
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
];

// Evening Adhkar (أذكار المساء)
export const eveningAdhkar: Dhikr[] = [
    ...morningAdhkar.filter(d => d.category === 'both'),
    {
        id: 'evening-1',
        arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        transliteration: 'Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamd, wa Huwa \'ala kulli shay\'in Qadir.',
        translation: 'We have entered the evening and the dominion belongs to Allah. Praise is to Allah. None has the right to be worshipped except Allah alone, with no partner. To Him belongs the dominion and to Him is the praise, and He is Able to do all things.',
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
];

// Get adhkar by category
export const getAdhkarByCategory = (category: 'morning' | 'evening'): Dhikr[] => {
    if (category === 'morning') {
        return morningAdhkar;
    }
    return eveningAdhkar;
};

// Get total adhkar count for a category
export const getAdhkarCount = (category: 'morning' | 'evening'): number => {
    return getAdhkarByCategory(category).length;
};
