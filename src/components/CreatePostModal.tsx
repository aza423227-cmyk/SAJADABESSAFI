import { useState, useRef } from 'react';
import { X, Sparkles, Image as ImageIcon, Check, Upload, Flame, BookOpen, Layers } from 'lucide-react';
import { UserProfile, FeedPost, Story } from '../types';

interface CreatePostModalProps {
  onClose: () => void;
  onPublish: (newPost: FeedPost) => void;
  onPublishStory?: (newStory: Story) => void;
  currentUser?: UserProfile | null;
  initialDestination?: 'feed' | 'story';
}

const RELIGIOUS_PHOTO_PRESETS = [
  { id: 'kaaba', name: 'الكعبة المشرفة', url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&auto=format&fit=crop&q=80' },
  { id: 'madina', name: 'المسجد النبوي', url: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&auto=format&fit=crop&q=80' },
  { id: 'dome', name: 'المسجد الأقصى', url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&auto=format&fit=crop&q=80' },
  { id: 'quran', name: 'المصحف الشريف', url: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&auto=format&fit=crop&q=80' },
  { id: 'stars', name: 'مئذنة بالليل', url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&auto=format&fit=crop&q=80' }
];

const THEME_GRADIENTS = [
  { id: 'emerald', name: 'أخضر روحاني', bg: 'bg-gradient-to-br from-emerald-900 to-teal-950', text: 'text-emerald-200' },
  { id: 'sunset', name: 'ذهبي أصيل', bg: 'bg-gradient-to-br from-amber-900 via-rose-950 to-stone-950', text: 'text-amber-200' },
  { id: 'night', name: 'ليلي وسماء', bg: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-stone-950', text: 'text-indigo-200' },
  { id: 'minimal', name: 'أسود فخم', bg: 'bg-stone-900 border border-stone-800', text: 'text-amber-100' },
];

export default function CreatePostModal({
  onClose,
  onPublish,
  onPublishStory,
  currentUser,
  initialDestination = 'story'
}: CreatePostModalProps) {
  const [destination, setDestination] = useState<'story' | 'feed'>(initialDestination);
  const [postType, setPostType] = useState<'verse' | 'hadith' | 'dua' | 'reflection'>('verse');
  const [arabicText, setArabicText] = useState('حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ');
  const [translation, setTranslation] = useState('« Allah nous suffit ; Il est notre meilleur garant. »');
  const [source, setSource] = useState('Sourate Al-Imran · Verset 173');
  const [category, setCategory] = useState('Paix & Sérénité');
  const [selectedImage, setSelectedImage] = useState<string | null>(RELIGIOUS_PHOTO_PRESETS[0].url);
  const [isCustomUploaded, setIsCustomUploaded] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(THEME_GRADIENTS[0]);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePreFillTemplate = (type: 'verse' | 'hadith' | 'dua') => {
    if (type === 'verse') {
      setArabicText('حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ');
      setTranslation('« Allah nous suffit ; Il est notre meilleur garant. »');
      setSource('Sourate Al-Imran · Verset 173');
      setCategory('Paix & Sérénité');
    } else if (type === 'hadith') {
      setArabicText('احْفَظِ اللَّهَ يَحْفَظْكَ');
      setTranslation('« Préserve Allah (en observant Ses commandements), Il te préservera. »');
      setSource('Rapporté par At-Tirmidhi');
      setCategory('Gratitude & Bienveillance');
    } else if (type === 'dua') {
      setArabicText('رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي');
      setTranslation('« Seigneur, ouvre-moi ma poitrine et facilite ma mission. »');
      setSource('Sourate Ta-Ha · Versets 25-26');
      setCategory('Paix & Sérénité');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setImageError('حجم الصورة كبير جداً (أقصى حد 10 ميجابايت)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSelectedImage(event.target.result);
        setIsCustomUploaded(true);
        setImageError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!translation.trim() || !source.trim()) return;

    const authorName = currentUser ? currentUser.name : 'أنا (تذكير)';
    const authorHandle = currentUser ? currentUser.username : '@sajada.user';
    const authorAvatar = currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';

    if (destination === 'story' && onPublishStory) {
      const newStory: Story = {
        id: `story-${Date.now()}`,
        title: arabicText ? arabicText.slice(0, 15) : 'تذكير روحي',
        category: category,
        author: authorName,
        authorAvatar: authorAvatar,
        coverImage: selectedImage || RELIGIOUS_PHOTO_PRESETS[0].url,
        isViewed: false,
        items: [
          {
            id: `item-${Date.now()}`,
            type: selectedImage ? 'image' : 'quote',
            image: selectedImage || undefined,
            arabicText: arabicText.trim() || undefined,
            translation: translation.trim(),
            source: source.trim(),
            context: 'تذكير مبارك من معرض الصور الدينية'
          }
        ]
      };
      onPublishStory(newStory);
    } else {
      const newPost: FeedPost = {
        id: `custom-${Date.now()}`,
        type: postType,
        authorName,
        authorHandle,
        authorAvatar,
        isVerified: true,
        timestamp: 'الآن',
        category,
        arabicText: arabicText.trim() || undefined,
        translation: translation.trim(),
        source: source.trim(),
        imageUrl: selectedImage || undefined,
        likes: 1,
        isLiked: true,
        saves: 0,
        isSaved: false,
        commentsCount: 0,
        comments: []
      };
      onPublish(newPost);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-2xl text-stone-900 dark:text-stone-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1 text-emerald-600 dark:text-emerald-400">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-base font-bold font-arabic">
            إضافة صورة وقصة دينية
          </h3>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
          اختر صورة دينية من هاتفك أو من المعرض وانشرها كقصة (Story) أو في Flux ليراها الجميع ويحمّلها.
        </p>

        {/* Destination Toggle (Story vs Feed) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => setDestination('story')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              destination === 'story'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>نشر كقصة (Story) 📸</span>
          </button>
          <button
            type="button"
            onClick={() => setDestination('feed')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              destination === 'feed'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>نشر في Flux الرئيسي 📜</span>
          </button>
        </div>

        {/* Quick templates */}
        <div className="mb-4">
          <span className="text-[11px] text-stone-400 block mb-1.5 font-medium">نماذج روحانية سريعة :</span>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => handlePreFillTemplate('verse')}
              className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 shrink-0"
            >
              حسبنا الله ونعم الوكيل
            </button>
            <button
              type="button"
              onClick={() => handlePreFillTemplate('dua')}
              className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 shrink-0"
            >
              رب اشرح لي صدري
            </button>
            <button
              type="button"
              onClick={() => handlePreFillTemplate('hadith')}
              className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 shrink-0"
            >
              احفظ الله يحفظك
            </button>
          </div>
        </div>

        {/* Religious Image Picker & Phone Gallery Upload */}
        <div className="mb-4 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
              <span>الصورة الدينية للقصة</span>
            </span>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>رفع من معرض هاتفي</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {imageError && (
            <p className="text-rose-500 text-xs mb-2">{imageError}</p>
          )}

          {/* Religious presets gallery */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {RELIGIOUS_PHOTO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setSelectedImage(preset.url);
                  setIsCustomUploaded(false);
                }}
                className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-transform active:scale-95 shrink-0 ${
                  selectedImage === preset.url && !isCustomUploaded
                    ? 'border-emerald-500 scale-105 shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                title={preset.name}
              >
                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-white py-0.5 text-center truncate px-0.5">
                  {preset.name}
                </span>
                {selectedImage === preset.url && !isCustomUploaded && (
                  <span className="absolute top-1 right-1 bg-emerald-500 text-white p-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            ))}

            {isCustomUploaded && selectedImage && (
              <div className="relative w-16 h-20 rounded-xl overflow-hidden border-2 border-emerald-500 scale-105 shadow-md shrink-0">
                <img src={selectedImage} alt="custom upload" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-emerald-700 text-[9px] text-white py-0.5 text-center truncate">
                  من هاتفك
                </span>
                <span className="absolute top-1 right-1 bg-emerald-500 text-white p-0.5 rounded-full">
                  <Check className="w-3 h-3" />
                </span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Arabic text input */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              النص القرآني أو الدعاء (بالعربية)
            </label>
            <input
              type="text"
              dir="rtl"
              placeholder="مثال: لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا"
              value={arabicText}
              onChange={(e) => setArabicText(e.target.value)}
              className="w-full font-arabic text-lg bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2 text-stone-900 dark:text-amber-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Translation */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              الترجمة أو المعنى الروحي <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="« Allah nous suffit ; Il est notre meilleur garant. »"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              required
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Source reference */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              المصدر أو السورة <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="مثال: سورة آل عمران · الآية 173"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!translation.trim() || !source.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{destination === 'story' ? 'نشر في القصة الآن 📸' : 'نشر في Flux 📜'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
