import { Story, FeedPost, DhikrPreset } from '../types';

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-1',
    title: 'Verset du Jour',
    category: 'Verset',
    author: 'Sajda Équipe',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    coverImage: '/src/assets/images/sajda_story_quran_serenity_1793965097705.jpg',
    isViewed: false,
    items: [
      {
        id: 's1-item-1',
        type: 'quote',
        image: '/src/assets/images/sajda_story_quran_serenity_1793965097705.jpg',
        arabicText: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا',
        transliteration: 'Fa inna ma\'al \'usri yusra. Inna ma\'al \'usri yusra.',
        translation: '« À côté de la difficulté est certes une facilité ! Oui, à côté de la difficulté est certes une facilité. »',
        source: 'Sourate Ash-Sharh (L\'Ouverture) · Versets 5-6',
        context: 'Un rappel puissant qu\'aucune difficulté ne vient seule : la délivrance est promise au cœur même de l\'épreuve.'
      },
      {
        id: 's1-item-2',
        type: 'text',
        image: '/src/assets/images/sajda_story_quran_serenity_1793965097705.jpg',
        arabicText: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
        transliteration: 'Ala bi-dhikrillahi tatma\'innul-qulub.',
        translation: '« N\'est-ce point par l\'évocation d\'Allah que les cœurs se tranquillisent ? »',
        source: 'Sourate Ar-Ra\'d (Le Tonnerre) · Verset 28',
        context: 'Quand le bruit du monde devient assourdissant, le refuge réside dans le souvenir d\'Allah.'
      }
    ]
  },
  {
    id: 'story-2',
    title: 'Coucher de Soleil',
    category: 'Adhkar',
    author: 'Rappels du Cœur',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    coverImage: '/src/assets/images/sajda_story_mosque_sunset_1793965100201.jpg',
    isViewed: false,
    items: [
      {
        id: 's2-item-1',
        type: 'quote',
        image: '/src/assets/images/sajda_story_mosque_sunset_1793965100201.jpg',
        arabicText: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
        transliteration: 'Amsayna wa amsal-mulku lillah wal-hamdu lillah.',
        translation: '« Nous voici au soir, et au soir la royauté appartient à Allah, et louange à Allah. »',
        source: 'Adhkar du Soir · Rapporté par Muslim',
        context: 'Accueillez la fin du jour avec reconnaissance et sérénité.'
      }
    ]
  },
  {
    id: 'story-3',
    title: 'La Mecque la Nuit',
    category: 'Spiritualité',
    author: 'Al-Haramain',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    coverImage: '/src/assets/images/sajda_feed_mecca_night_1793965099116.jpg',
    isViewed: false,
    items: [
      {
        id: 's3-item-1',
        type: 'quote',
        image: '/src/assets/images/sajda_feed_mecca_night_1793965099116.jpg',
        arabicText: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        transliteration: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina \'adhaban-nar.',
        translation: '« Seigneur ! Accorde-nous belle part ici-bas, et belle part aussi dans l\'au-delà ; et protège-nous du châtiment du Feu. »',
        source: 'Sourate Al-Baqarah · Verset 201',
        context: 'L\'invocation la plus récitée par le Messager d\'Allah ﷺ lors de son Tawaf.'
      }
    ]
  },
  {
    id: 'story-4',
    title: 'Nuit & Étoiles',
    category: 'Méditation',
    author: 'Tadabbur',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    coverImage: '/src/assets/images/sajda_feed_nature_stars_1793965099973.jpg',
    isViewed: false,
    items: [
      {
        id: 's4-item-1',
        type: 'quote',
        image: '/src/assets/images/sajda_feed_nature_stars_1793965099973.jpg',
        arabicText: 'إِنَّ فِي خَلْقِ السَّمَاوَاتِ وَالْأَرْضِ وَاخْتِلَافِ اللَّيْلِ وَالنَّهَارِ لَآيَاتٍ لِّأُولِي الْأَلْبَابِ',
        transliteration: 'Inna fi khalqis-samawati wal-ardi wakhtilafil-layli wan-nahari la-ayatin li-ulil-albab.',
        translation: '« En vérité, dans la création des cieux et de la terre, et dans l\'alternance de la nuit et du jour, il y a certes des signes pour les doués d\'intelligence. »',
        source: 'Sourate Al-Imran · Verset 190',
        context: 'Le Prophète ﷺ pleurait d\'émotion en récitant ce verset au cœur de la nuit.'
      }
    ]
  },
  {
    id: 'story-5',
    title: 'Sunnah & Bienfaits',
    category: 'Sunnah',
    author: 'Hadith Quotidien',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    coverImage: '/src/assets/images/sajda_story_mosque_sunset_1793965100201.jpg',
    isViewed: true,
    items: [
      {
        id: 's5-item-1',
        type: 'quote',
        image: '/src/assets/images/sajda_story_mosque_sunset_1793965100201.jpg',
        arabicText: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
        transliteration: 'Tabassumuka fi wajhi akhika laka sadaqah.',
        translation: '« Ton sourire à l\'égard de ton frère est une aumône pour toi. »',
        source: 'Jami\' at-Tirmidhi (1956)',
        context: 'La gentillesse et le visage avenant sont un acte d\'adoration à la portée de tous.'
      }
    ]
  }
];

export const INITIAL_POSTS: FeedPost[] = [
  {
    id: 'post-1',
    type: 'verse',
    authorName: 'Sajda Méditation',
    authorHandle: '@sajda.app',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    isVerified: true,
    timestamp: 'Il y a 25 min',
    category: 'Paix & Sérénité',
    arabicText: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
    transliteration: 'Wa idha sa\'alaka \'ibadi \'anni fa\'inni qarib, ujibu da\'watad-da\'i idha da\'ani',
    translation: '« Et quand Mes serviteurs t\'interrogent sur Moi.. alors Je suis tout proche : Je réponds à l\'appel de celui qui M\'invoque quand il M\'invoque. »',
    source: 'Sourate Al-Baqarah (La Vache) · Verset 186',
    context: 'Allah ne te demande aucun intermédiaire pour Lui confier tes secrets, tes peines ou tes espoirs. Il est plus proche de toi que ta propre veine jugulaire.',
    imageUrl: '/src/assets/images/sajda_story_quran_serenity_1793965097705.jpg',
    likes: 842,
    isLiked: false,
    saves: 319,
    isSaved: false,
    commentsCount: 28,
    comments: [
      {
        id: 'c1',
        author: 'Nour El-Houda',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
        text: 'Ce verset apaise tellement l\'âme après une journée éprouvante. Al-Hamdulillah 🤍',
        timestamp: 'Il y a 15 min'
      },
      {
        id: 'c2',
        author: 'Yassine M.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
        text: '« Je réponds à l\'appel de celui qui M\'invoque »... Une certitude dont on a tous besoin.',
        timestamp: 'Il y a 8 min'
      }
    ],
    audioTitle: 'Récitation apaisante',
    reciter: 'Cheikh Mishary Rashid'
  },
  {
    id: 'post-2',
    type: 'dua',
    authorName: 'Adhkar & Tasbih',
    authorHandle: '@dhikr.daily',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    isVerified: true,
    timestamp: 'Il y a 1h',
    category: 'Dhikr Interactif',
    arabicText: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: 'Subhān Allāhi wa bi-hamdihi, Subhān Allāhil-\'Adhīm',
    translation: '« Gloire et louange à Allah, Gloire à Allah l\'Immense. »',
    source: 'Sahih Al-Bukhari (6406) & Muslim (2694)',
    context: 'Le Prophète ﷺ a dit : « Deux paroles sont légères sur la langue, lourdes sur la balance, et bien-aimées du Tout-Miséricordieux. »',
    imageUrl: '/src/assets/images/sajda_feed_mecca_night_1793965099116.jpg',
    likes: 1250,
    isLiked: true,
    saves: 560,
    isSaved: true,
    commentsCount: 42,
    dhikrGoal: 33,
    dhikrCurrent: 7,
    comments: [
      {
        id: 'c3',
        author: 'Amina S.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
        text: 'Le compteur directement dans le post est une idée tellement géniale ! BarakAllahu fikoum.',
        timestamp: 'Il y a 45 min'
      }
    ]
  },
  {
    id: 'post-3',
    type: 'poll',
    authorName: 'Sajda Communauté',
    authorHandle: '@sajda.community',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    isVerified: true,
    timestamp: 'Il y a 2h',
    category: 'Sondage & Réflexion',
    translation: 'Quelle sourate est votre refuge privilégié lorsque le stress ou l\'anxiété se fait sentir au quotidien ?',
    source: 'Question spirituelle du jour',
    pollQuestion: 'Votre sourate refuge pour retrouver la paix intérieure :',
    pollOptions: [
      { id: 'opt-1', text: 'Sourate Ash-Sharh (L\'Ouverture 94)', votes: 342 },
      { id: 'opt-2', text: 'Sourate Ad-Duha (Le Jour Montant 93)', votes: 218 },
      { id: 'opt-3', text: 'Sourate Yusuf (La Patience 12)', votes: 164 },
      { id: 'opt-4', text: 'Sourate Ar-Rahman (Le Tout-Miséricordieux 55)', votes: 289 }
    ],
    userVotedId: undefined,
    likes: 412,
    isLiked: false,
    saves: 95,
    isSaved: false,
    commentsCount: 63,
    comments: [
      {
        id: 'c4',
        author: 'Bilal K.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
        text: 'Sourate Ad-Duha pour moi, particulièrement « Et ton Seigneur t\'accordera certes Ses dons, et alors tu seras satisfait ». Des larmes à chaque écoute.',
        timestamp: 'Il y a 1h'
      }
    ]
  },
  {
    id: 'post-4',
    type: 'hadith',
    authorName: 'Perles de Sagesse',
    authorHandle: '@hadith.verite',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    isVerified: true,
    timestamp: 'Il y a 4h',
    category: 'Gratitude & Bienveillance',
    arabicText: 'مَنْ لَا يَشْكُرُ النَّاسَ لَا يَشْكُرُ اللَّهَ',
    transliteration: 'Man la yashkurin-nasa la yashkurillah.',
    translation: '« Celui qui ne remercie pas les gens ne remercie pas Allah. »',
    source: 'Rapporté par At-Tirmidhi (1954) · Hadith Sahih',
    context: 'La spiritualité islamique n\'est pas déconnectée de la vie sociale. Exprimer de la gratitude aux personnes qui nous entourent fait partie intégrante de notre foi.',
    likes: 720,
    isLiked: false,
    saves: 210,
    isSaved: false,
    commentsCount: 19,
    comments: []
  },
  {
    id: 'post-5',
    type: 'reflection',
    authorName: 'Méditation Céleste',
    authorHandle: '@tadabbur.stars',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    isVerified: true,
    timestamp: 'Il y a 6h',
    category: 'Contemplation',
    arabicText: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ',
    transliteration: 'Alladhi khalaqa sab\'a samawatin tibaqa, ma tara fi khalqir-Rahmani min tafawut.',
    translation: '« Celui qui a créé sept cieux superposés sans que tu ne voies d\'imperfection dans la création du Tout Miséricordieux. »',
    source: 'Sourate Al-Mulk (La Royauté) · Verset 3',
    context: 'Levez les yeux vers les étoiles ce soir. Cette immensité ordonnée avec une infinie précision est la même qui veille sur votre cœur et vos moindres murmures.',
    imageUrl: '/src/assets/images/sajda_feed_nature_stars_1793965099973.jpg',
    likes: 1530,
    isLiked: true,
    saves: 620,
    isSaved: false,
    commentsCount: 37,
    comments: []
  }
];

export const DHIKR_PRESETS: DhikrPreset[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhān Allāh',
    translation: 'Gloire et pureté à Allah',
    virtue: 'Efface les péchés et plante un palmier au Paradis pour chaque répétition.',
    recommendedTarget: 33
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Al-Hamdu Lillāh',
    translation: 'Louange à Allah',
    virtue: 'Remplit la balance des bonnes actions au Jour du Jugement.',
    recommendedTarget: 33
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allāhu Akbar',
    translation: 'Allah est le Plus Grand',
    virtue: 'Rappelle la grandeur absolue du Créateur face à toute difficulté humaine.',
    recommendedTarget: 34
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullāh wa atūbu ilayh',
    translation: 'Je demande pardon à Allah et je me repens à Lui',
    virtue: 'Ouvre les portes de la subsistance, dissipe les soucis et apporte la sérénité.',
    recommendedTarget: 100
  },
  {
    id: 'lailahaillallah',
    arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ',
    transliteration: 'Lā ilāha illā Allāh',
    translation: 'Il n\'y a de divinité digne d\'adoration qu\'Allah',
    virtue: 'La meilleure parole prononcée par les Prophètes, clé du Paradis.',
    recommendedTarget: 100
  },
  {
    id: 'salawat',
    arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
    transliteration: 'Allāhumma salli wa sallim \'alā nabiyyinā Muhammad',
    translation: 'Ô Allah, prie et accorde Ta paix sur notre Prophète Muhammad',
    virtue: 'Pour chaque prière sur le Prophète, Allah vous bénit dix fois et élève vos rangs.',
    recommendedTarget: 100
  },
  {
    id: 'hawqala',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Lā hawla wa lā quwwata illā billāh',
    translation: 'Il n\'y a de force ni de puissance que par Allah',
    virtue: 'Un des trésors inestimables du Paradis, remède contre l\'angoisse.',
    recommendedTarget: 33
  }
];
