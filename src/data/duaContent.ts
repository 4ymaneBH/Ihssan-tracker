// Du'a Collection - Curated supplications for various occasions

export interface Dua {
    id: string;
    arabic: string;
    transliteration: string;
    translation: string;
    translationAr: string;
    category: DuaCategory;
    reference: string;
    occasion?: string;
    occasionAr?: string;
}

export type DuaCategory =
    | 'daily'
    | 'morning_evening'
    | 'prayer'
    | 'travel'
    | 'food'
    | 'protection'
    | 'forgiveness'
    | 'gratitude'
    | 'anxiety'
    | 'sleep';

export const duaCategories: DuaCategory[] = [
    'daily',
    'morning_evening',
    'prayer',
    'travel',
    'food',
    'protection',
    'forgiveness',
    'gratitude',
    'anxiety',
    'sleep',
];

export const getCategoryLabel = (category: DuaCategory, isArabic: boolean): string => {
    const labels: Record<DuaCategory, { en: string; ar: string }> = {
        daily: { en: 'Daily', ar: 'يومية' },
        morning_evening: { en: 'Morning & Evening', ar: 'الصباح والمساء' },
        prayer: { en: 'Prayer', ar: 'الصلاة' },
        travel: { en: 'Travel', ar: 'السفر' },
        food: { en: 'Food & Drink', ar: 'الطعام والشراب' },
        protection: { en: 'Protection', ar: 'الحماية' },
        forgiveness: { en: 'Forgiveness', ar: 'الاستغفار' },
        gratitude: { en: 'Gratitude', ar: 'الشكر' },
        anxiety: { en: 'Anxiety & Stress', ar: 'القلق والهم' },
        sleep: { en: 'Sleep', ar: 'النوم' },
    };
    return isArabic ? labels[category].ar : labels[category].en;
};

export const getCategoryIcon = (category: DuaCategory): string => {
    const icons: Record<DuaCategory, string> = {
        daily: 'calendar-today',
        morning_evening: 'weather-sunny',
        prayer: 'mosque',
        travel: 'airplane',
        food: 'food-apple',
        protection: 'shield-check',
        forgiveness: 'heart-broken',
        gratitude: 'hand-heart',
        anxiety: 'meditation',
        sleep: 'bed',
    };
    return icons[category];
};

// Curated Du'a Collection
export const duaCollection: Dua[] = [
    // === DAILY DU'AS ===
    {
        id: 'dua-1',
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina adhaban-nar',
        translation: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.',
        translationAr: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار',
        category: 'daily',
        reference: 'Quran 2:201',
        occasion: 'General supplication',
        occasionAr: 'دعاء عام',
    },
    {
        id: 'dua-2',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
        transliteration: 'Allahumma inni as\'aluka al-huda wat-tuqa wal-\'afafa wal-ghina',
        translation: 'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.',
        translationAr: 'اللهم إني أسألك الهدى والتقى والعفاف والغنى',
        category: 'daily',
        reference: 'Muslim',
        occasion: 'Daily supplication',
        occasionAr: 'دعاء يومي',
    },
    {
        id: 'dua-3',
        arabic: 'اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي',
        transliteration: 'Allahumma aslih li deeni alladhi huwa \'ismatu amri, wa aslih li dunyaya allati fiha ma\'ashi, wa aslih li akhirati allati fiha ma\'adi',
        translation: 'O Allah, set right my religion which is the safeguard of my affairs, and set right my worldly life wherein is my livelihood, and set right my Hereafter to which is my return.',
        translationAr: 'اللهم أصلح لي ديني الذي هو عصمة أمري وأصلح لي دنياي التي فيها معاشي وأصلح لي آخرتي التي فيها معادي',
        category: 'daily',
        reference: 'Muslim',
    },

    // === MORNING & EVENING ===
    {
        id: 'dua-4',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
        transliteration: 'Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah',
        translation: 'We have entered the morning and the dominion belongs to Allah. Praise is to Allah. None has the right to be worshipped but Allah alone, with no partner.',
        translationAr: 'أصبحنا وأصبح الملك لله والحمد لله لا إله إلا الله وحده لا شريك له',
        category: 'morning_evening',
        reference: 'Abu Dawud',
        occasion: 'Morning',
        occasionAr: 'الصباح',
    },
    {
        id: 'dua-5',
        arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
        transliteration: 'Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur',
        translation: 'O Allah, by Your leave we have reached the morning, by Your leave we reach the evening, by Your leave we live and die, and to You is the resurrection.',
        translationAr: 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور',
        category: 'morning_evening',
        reference: 'Tirmidhi',
        occasion: 'Morning',
        occasionAr: 'الصباح',
    },
    {
        id: 'dua-6',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
        transliteration: 'Allahumma inni as\'alukal-\'afiyah fid-dunya wal-akhirah',
        translation: 'O Allah, I ask You for well-being in this world and the Hereafter.',
        translationAr: 'اللهم إني أسألك العافية في الدنيا والآخرة',
        category: 'morning_evening',
        reference: 'Ibn Majah',
    },

    // === PRAYER ===
    {
        id: 'dua-7',
        arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
        transliteration: 'Rabbi ij\'alni muqimas-salati wa min dhurriyyati Rabbana wa taqabbal du\'a',
        translation: 'My Lord, make me an establisher of prayer, and from my descendants. Our Lord, accept my supplication.',
        translationAr: 'رب اجعلني مقيم الصلاة ومن ذريتي ربنا وتقبل دعاء',
        category: 'prayer',
        reference: 'Quran 14:40',
    },
    {
        id: 'dua-8',
        arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ',
        transliteration: 'Allahumma a\'inni \'ala dhikrika, wa shukrika, wa husni \'ibadatik',
        translation: 'O Allah, help me to remember You, to thank You, and to worship You in the best manner.',
        translationAr: 'اللهم أعني على ذكرك وشكرك وحسن عبادتك',
        category: 'prayer',
        reference: 'Abu Dawud',
        occasion: 'After prayer',
        occasionAr: 'بعد الصلاة',
    },

    // === TRAVEL ===
    {
        id: 'dua-9',
        arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',
        transliteration: 'Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin wa inna ila Rabbina lamunqalibun',
        translation: 'Glory to Him Who has subjected this to us, and we could never have it. And indeed, to our Lord we will return.',
        translationAr: 'سبحان الذي سخر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون',
        category: 'travel',
        reference: 'Quran 43:13-14',
        occasion: 'When starting a journey',
        occasionAr: 'عند بدء السفر',
    },
    {
        id: 'dua-10',
        arabic: 'اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَٰذَا وَاطْوِ عَنَّا بُعْدَهُ',
        transliteration: 'Allahumma hawwin \'alayna safarana hadha watw \'anna bu\'dah',
        translation: 'O Allah, make this journey easy for us and shorten its distance.',
        translationAr: 'اللهم هون علينا سفرنا هذا واطو عنا بعده',
        category: 'travel',
        reference: 'Muslim',
    },

    // === FOOD ===
    {
        id: 'dua-11',
        arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
        transliteration: 'Bismillahi wa \'ala barakatillah',
        translation: 'In the name of Allah and with the blessing of Allah.',
        translationAr: 'بسم الله وعلى بركة الله',
        category: 'food',
        reference: 'Abu Dawud',
        occasion: 'Before eating',
        occasionAr: 'قبل الأكل',
    },
    {
        id: 'dua-12',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
        transliteration: 'Alhamdu lillahil-ladhi at\'amana wa saqana wa ja\'alana muslimin',
        translation: 'Praise be to Allah Who has fed us and given us drink, and made us Muslims.',
        translationAr: 'الحمد لله الذي أطعمنا وسقانا وجعلنا مسلمين',
        category: 'food',
        reference: 'Abu Dawud',
        occasion: 'After eating',
        occasionAr: 'بعد الأكل',
    },

    // === PROTECTION ===
    {
        id: 'dua-13',
        arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        transliteration: 'Bismillahil-ladhi la yadurru ma\'a ismihi shay\'un fil-ardi wa la fis-sama\'i wa huwas-Sami\'ul-\'Alim',
        translation: 'In the name of Allah, with Whose name nothing can harm on earth or in heaven, and He is the All-Hearing, All-Knowing.',
        translationAr: 'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم',
        category: 'protection',
        reference: 'Abu Dawud, Tirmidhi',
        occasion: '3 times morning & evening',
        occasionAr: '٣ مرات صباحاً ومساءً',
    },
    {
        id: 'dua-14',
        arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        transliteration: 'A\'udhu bi kalimatillahit-tammati min sharri ma khalaq',
        translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
        translationAr: 'أعوذ بكلمات الله التامات من شر ما خلق',
        category: 'protection',
        reference: 'Muslim',
    },
    {
        id: 'dua-15',
        arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
        transliteration: 'Allahumma inni a\'udhu bika minal-hammi wal-hazan, wa a\'udhu bika minal-\'ajzi wal-kasal',
        translation: 'O Allah, I seek refuge in You from worry and grief, and I seek refuge in You from incapacity and laziness.',
        translationAr: 'اللهم إني أعوذ بك من الهم والحزن وأعوذ بك من العجز والكسل',
        category: 'protection',
        reference: 'Bukhari',
    },

    // === FORGIVENESS ===
    {
        id: 'dua-16',
        arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنتَ التَّوَّابُ الرَّحِيمُ',
        transliteration: 'Rabbighfir li wa tub \'alayya innaka antat-Tawwabur-Rahim',
        translation: 'My Lord, forgive me and accept my repentance. Indeed, You are the Accepting of repentance, the Merciful.',
        translationAr: 'رب اغفر لي وتب علي إنك أنت التواب الرحيم',
        category: 'forgiveness',
        reference: 'Tirmidhi',
    },
    {
        id: 'dua-17',
        arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
        transliteration: 'Astaghfirullaha al-\'Azeem alladhi la ilaha illa huwal-Hayyul-Qayyumu wa atubu ilayh',
        translation: 'I seek forgiveness from Allah, the Almighty, besides Whom there is no god, the Living, the Sustainer, and I repent to Him.',
        translationAr: 'أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه',
        category: 'forgiveness',
        reference: 'Abu Dawud, Tirmidhi',
    },
    {
        id: 'dua-18',
        arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ',
        transliteration: 'Allahummaghfir li dhanbi kullahu, diqqahu wa jillahu, wa awwalahu wa akhirahu, wa \'alaniyatahu wa sirrahu',
        translation: 'O Allah, forgive all my sins, great and small, the first and the last, those that are apparent and those that are hidden.',
        translationAr: 'اللهم اغفر لي ذنبي كله دقه وجله وأوله وآخره وعلانيته وسره',
        category: 'forgiveness',
        reference: 'Muslim',
    },

    // === GRATITUDE ===
    {
        id: 'dua-19',
        arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
        transliteration: 'Allahumma a\'inni \'ala dhikrika wa shukrika wa husni \'ibadatik',
        translation: 'O Allah, help me to remember You, to thank You, and to worship You in the best way.',
        translationAr: 'اللهم أعني على ذكرك وشكرك وحسن عبادتك',
        category: 'gratitude',
        reference: 'Abu Dawud',
    },
    {
        id: 'dua-20',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ',
        transliteration: 'Alhamdu lillahil-ladhi bi ni\'matihi tatimmus-salihat',
        translation: 'Praise be to Allah, by Whose grace good works are completed.',
        translationAr: 'الحمد لله الذي بنعمته تتم الصالحات',
        category: 'gratitude',
        reference: 'Ibn Majah',
        occasion: 'When something good happens',
        occasionAr: 'عند حدوث أمر سار',
    },

    // === ANXIETY & STRESS ===
    {
        id: 'dua-21',
        arabic: 'لَا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
        transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin',
        translation: 'There is no god but You, glory be to You. Indeed, I have been of the wrongdoers.',
        translationAr: 'لا إله إلا أنت سبحانك إني كنت من الظالمين',
        category: 'anxiety',
        reference: 'Quran 21:87 (Du\'a of Yunus)',
        occasion: 'In times of distress',
        occasionAr: 'في أوقات الشدة',
    },
    {
        id: 'dua-22',
        arabic: 'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
        transliteration: 'Hasbiyallahu la ilaha illa huwa, \'alayhi tawakkaltu, wa huwa Rabbul-\'Arshil-\'Azeem',
        translation: 'Allah is sufficient for me. There is no god but Him. I have placed my trust in Him, and He is the Lord of the Mighty Throne.',
        translationAr: 'حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم',
        category: 'anxiety',
        reference: 'Quran 9:129',
        occasion: '7 times morning & evening',
        occasionAr: '٧ مرات صباحاً ومساءً',
    },
    {
        id: 'dua-23',
        arabic: 'اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ',
        transliteration: 'Allahumma inni \'abduka, ibnu \'abdika, ibnu amatika, nasiyati biyadika, madin fiyya hukmuka, \'adlun fiyya qada\'uka',
        translation: 'O Allah, I am Your servant, son of Your male servant, son of Your female servant. My forelock is in Your hand, Your command over me is forever executed, and Your decree over me is just.',
        translationAr: 'اللهم إني عبدك ابن عبدك ابن أمتك ناصيتي بيدك ماض في حكمك عدل في قضاؤك',
        category: 'anxiety',
        reference: 'Ahmad',
        occasion: 'For relief from sadness',
        occasionAr: 'للتخلص من الحزن',
    },

    // === SLEEP ===
    {
        id: 'dua-24',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        transliteration: 'Bismika Allahumma amutu wa ahya',
        translation: 'In Your name, O Allah, I die and I live.',
        translationAr: 'باسمك اللهم أموت وأحيا',
        category: 'sleep',
        reference: 'Bukhari',
        occasion: 'Before sleeping',
        occasionAr: 'قبل النوم',
    },
    {
        id: 'dua-25',
        arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
        transliteration: 'Allahumma qini \'adhabaka yawma tab\'athu \'ibadak',
        translation: 'O Allah, protect me from Your punishment on the Day You resurrect Your servants.',
        translationAr: 'اللهم قني عذابك يوم تبعث عبادك',
        category: 'sleep',
        reference: 'Abu Dawud',
        occasion: 'Before sleeping',
        occasionAr: 'قبل النوم',
    },
    {
        id: 'dua-26',
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
        transliteration: 'Alhamdu lillahil-ladhi ahyana ba\'da ma amatana wa ilayhin-nushur',
        translation: 'Praise be to Allah Who has given us life after death and to Him is the resurrection.',
        translationAr: 'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور',
        category: 'sleep',
        reference: 'Bukhari',
        occasion: 'Upon waking up',
        occasionAr: 'عند الاستيقاظ',
    },
];

// Helper functions
export const getDuasByCategory = (category: DuaCategory): Dua[] => {
    return duaCollection.filter(dua => dua.category === category);
};

export const searchDuas = (query: string, isArabic: boolean): Dua[] => {
    const lowerQuery = query.toLowerCase();
    return duaCollection.filter(dua => {
        if (isArabic) {
            return dua.arabic.includes(query) ||
                dua.translationAr.includes(query) ||
                (dua.occasionAr?.includes(query) ?? false);
        }
        return dua.transliteration.toLowerCase().includes(lowerQuery) ||
            dua.translation.toLowerCase().includes(lowerQuery) ||
            (dua.occasion?.toLowerCase().includes(lowerQuery) ?? false);
    });
};

export const getDuaById = (id: string): Dua | undefined => {
    return duaCollection.find(dua => dua.id === id);
};
