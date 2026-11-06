import { useState } from 'react';
import { X, Sparkles, Image, Check, Heart } from 'lucide-react';
import { UserProfile, FeedPost } from '../types';

interface CreatePostModalProps {
  onClose: () => void;
  onPublish: (newPost: FeedPost) => void;
  currentUser?: UserProfile | null;
}

const THEME_GRADIENTS = [
  { id: 'emerald', name: 'Émeraude Sacrée', bg: 'bg-gradient-to-br from-emerald-900 to-teal-950', text: 'text-emerald-200' },
  { id: 'sunset', name: 'Crépuscule Doré', bg: 'bg-gradient-to-br from-amber-900 via-rose-950 to-stone-950', text: 'text-amber-200' },
  { id: 'night', name: 'Nuit & Étoiles', bg: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-stone-950', text: 'text-indigo-200' },
  { id: 'minimal', name: 'Éditorial Blanc & Sable', bg: 'bg-stone-900 border border-stone-800', text: 'text-amber-100' },
];

export default function CreatePostModal({ onClose, onPublish, currentUser }: CreatePostModalProps) {
  const [postType, setPostType] = useState<'verse' | 'hadith' | 'dua' | 'reflection'>('verse');
  const [arabicText, setArabicText] = useState('');
  const [translation, setTranslation] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState('Paix & Sérénité');
  const [selectedTheme, setSelectedTheme] = useState(THEME_GRADIENTS[0]);

  const handlePreFillTemplate = (type: 'verse' | 'hadith' | 'dua') => {
    if (type === 'verse') {
      setArabicText('حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ');
      setTranslation('« Allah nous suffit ; Il est notre meilleur garant. »');
      setSource('Sourate Al-Imran · Verset 173');
      setCategory('Patience & Confiance');
    } else if (type === 'hadith') {
      setArabicText('احْفَظِ اللَّهَ يَحْفَظْكَ');
      setTranslation('« Préserve Allah (en observant Ses commandements), Il te préservera. »');
      setSource('Rapporté par At-Tirmidhi');
      setCategory('Foi & Préservation');
    } else if (type === 'dua') {
      setArabicText('رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي');
      setTranslation('« Seigneur, ouvre-moi ma poitrine et facilite ma mission. »');
      setSource('Sourate Ta-Ha · Versets 25-26');
      setCategory('Apaisement & Sérénité');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!translation.trim() || !source.trim()) return;

    const newPost: FeedPost = {
      id: `custom-${Date.now()}`,
      type: postType,
      authorName: currentUser ? currentUser.name : 'أنا (تذكير)',
      authorHandle: currentUser ? currentUser.username : '@sajada.user',
      authorAvatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      isVerified: true,
      timestamp: 'الآن',
      category: category,
      arabicText: arabicText.trim() || undefined,
      translation: translation.trim(),
      source: source.trim(),
      likes: 1,
      isLiked: true,
      saves: 0,
      isSaved: false,
      commentsCount: 0,
      comments: []
    };

    onPublish(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-2xl text-stone-900 dark:text-stone-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1 text-emerald-600 dark:text-emerald-400">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-base font-bold">Créer un Rappel Spirituel</h3>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-5">
          Concevez une carte inspirante pour le flux ou votre story quotidienne.
        </p>

        {/* Quick templates */}
        <div className="mb-4">
          <span className="text-xs text-stone-400 block mb-1.5">Modèles rapides :</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePreFillTemplate('verse')}
              className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300"
            >
              HasbunAllah (Verset)
            </button>
            <button
              type="button"
              onClick={() => handlePreFillTemplate('dua')}
              className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300"
            >
              Rabbi Ishrah (Du'a)
            </button>
            <button
              type="button"
              onClick={() => handlePreFillTemplate('hadith')}
              className="px-2.5 py-1 text-xs rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300"
            >
              Ihfazillah (Hadith)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Type de rappel
              </label>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value as any)}
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-800 dark:text-stone-200"
              >
                <option value="verse">Verset du Coran</option>
                <option value="hadith">Hadith Prophétique</option>
                <option value="dua">Invocation (Du'a)</option>
                <option value="reflection">Méditation / Pensée</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Thématique
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-800 dark:text-stone-200"
              >
                <option value="Paix & Sérénité">Paix & Sérénité</option>
                <option value="Gratitude & Bienveillance">Gratitude & Bienveillance</option>
                <option value="Patience & Épreuves">Patience & Épreuves</option>
                <option value="Prière & Sajda">Prière & Sajda</option>
                <option value="Pardon & Tawbah">Pardon & Tawbah</option>
              </select>
            </div>
          </div>

          {/* Arabic text input */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Texte Arabe (optionnel)
            </label>
            <input
              type="text"
              dir="rtl"
              placeholder="Ex: لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا"
              value={arabicText}
              onChange={(e) => setArabicText(e.target.value)}
              className="w-full font-arabic text-lg bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-stone-900 dark:text-amber-100"
            />
          </div>

          {/* French translation */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Traduction / Rappel en français <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="« Allah n'impose à aucune âme une charge supérieure à sa capacité... »"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              required
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Source reference */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Référence / Source <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Sourate Al-Baqarah · Verset 286"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100"
            />
          </div>

          {/* Live Card Preview */}
          <div className="pt-2">
            <span className="text-xs text-stone-400 block mb-1">Aperçu direct de la carte :</span>
            <div className={`p-4 rounded-2xl ${selectedTheme.bg} text-white shadow-md transition-all`}>
              {arabicText && (
                <p className="font-arabic text-xl text-center text-amber-200/95 mb-2">
                  {arabicText}
                </p>
              )}
              <p className="text-xs sm:text-sm text-center leading-relaxed font-medium">
                {translation || 'Votre rappel spirituel apparaîtra ici...'}
              </p>
              <div className="text-[11px] text-center text-stone-300 mt-2 font-light">
                — {source || 'Source du rappel'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!translation.trim() || !source.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Publier dans mon flux</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
