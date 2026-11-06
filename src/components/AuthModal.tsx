import { useState, useRef } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  MapPin,
  Check,
  LogOut,
  Sparkles,
  Flame,
  Bookmark,
  ShieldCheck,
  ArrowRight,
  Upload,
  Download,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  currentUser: UserProfile | null;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  currentCityName?: string;
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80'
];

export default function AuthModal({
  currentUser,
  onClose,
  onLogin,
  onLogout,
  currentCityName = 'Paris'
}: AuthModalProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0]);
  const [customAvatarUploaded, setCustomAvatarUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setError('حجم الصورة كبير جداً (أقصى حد 8 ميجابايت)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        const base64 = event.target.result;
        setSelectedAvatar(base64);
        setCustomAvatarUploaded(true);
        setError(null);
        setToastMessage('تم تحميل صورتك الشخصية من معرض الهاتف بنجاح ✓');
        setTimeout(() => setToastMessage(null), 3000);

        if (currentUser) {
          const updatedUser: UserProfile = { ...currentUser, avatar: base64 };
          onLogin(updatedUser);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadAvatar = () => {
    const imgUrl = currentUser?.avatar || selectedAvatar;
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `sajada-bessafi-profile-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setToastMessage('تم تنزيل صورتك الشخصية إلى جهازك 📥');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    if (!password || password.length < 4) {
      setError('كلمة المرور يجب أن تكون 4 أحرف على الأقل');
      return;
    }

    if (isRegisterMode) {
      if (!name.trim()) {
        setError('يرجى إدخال اسمك الكريم');
        return;
      }
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        username: username.trim() ? `@${username.replace('@', '')}` : `@${name.toLowerCase().replace(/\s+/g, '_')}`,
        email: email.trim().toLowerCase(),
        avatar: selectedAvatar,
        city: currentCityName,
        joinedDate: 'نوفمبر 2026',
        streakDays: 1,
        totalDhikrs: 0,
        isVerified: true
      };
      onLogin(newUser);
      onClose();
    } else {
      // Login mode
      const loggedUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        username: `@${email.split('@')[0]}`,
        email: email.trim().toLowerCase(),
        avatar: selectedAvatar,
        city: currentCityName,
        joinedDate: 'عضو مسجل',
        streakDays: 7,
        totalDhikrs: 248,
        isVerified: true
      };
      onLogin(loggedUser);
      onClose();
    }
  };

  const handleQuickDemoLogin = () => {
    const demoUser: UserProfile = {
      id: 'demo-ahmed',
      name: 'احمد بصافي',
      username: '@ahmed_bessafi',
      email: 'ahmed.bessafi@gmail.com',
      avatar: DEFAULT_AVATARS[1],
      city: currentCityName,
      joinedDate: 'رمضان 1447 هـ',
      streakDays: 14,
      totalDhikrs: 840,
      isVerified: true,
      bio: '« أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ » 🌿'
    };
    onLogin(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-2xl text-stone-900 dark:text-stone-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LOGGED-IN PROFILE VIEW */}
        {currentUser ? (
          <div className="space-y-5 pt-2">
            {toastMessage && (
              <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs text-center font-medium">
                {toastMessage}
              </div>
            )}

            <div className="text-center">
              <div className="relative inline-block group">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-22 h-22 rounded-full object-cover border-4 border-emerald-500 mx-auto shadow-md"
                />
                {currentUser.isVerified && (
                  <span className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full ring-2 ring-white dark:ring-stone-900">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                )}
                {/* Quick change photo badge on avatar */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                  title="تغيير الصورة من المعرض"
                >
                  <Camera className="w-6 h-6" />
                </button>
              </div>

              {/* Upload & Download Buttons for personal photo */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>تغيير صورتي من المعرض</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadAvatar}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="تنزيل صورتي الشخصية إلى معرض الهاتف"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تنزيل الصورة</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <h3 className="text-lg font-bold font-arabic mt-3 text-stone-900 dark:text-stone-100">
                {currentUser.name}
              </h3>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                {currentUser.username} · {currentUser.email}
              </div>
              {currentUser.bio && (
                <p className="text-xs italic text-stone-600 dark:text-stone-300 mt-2 bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                  {currentUser.bio}
                </p>
              )}
            </div>

            {/* User Spiritual Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700">
                <div className="text-base font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                  {currentUser.streakDays}
                </div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400">أيام متتالية</div>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700">
                <div className="text-base font-extrabold font-mono tabular-nums text-stone-900 dark:text-stone-100">
                  {currentUser.totalDhikrs}
                </div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400">تسبيحة</div>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700">
                <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                  {currentUser.city || currentCityName}
                </div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400">موقع الصلاة</div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="text-xs text-stone-400">انضم في {currentUser.joinedDate}</span>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        ) : (
          /* LOGIN & SIGN UP FORM */
          <div>
            <div className="flex items-center gap-2 mb-1 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-base font-bold font-arabic">
                {isRegisterMode ? 'إنشاء حساب جديد في SAJADA BESSAFI' : 'تسجيل الدخول'}
              </h3>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-5">
              {isRegisterMode
                ? 'انضم لمجتمع التواصي الروحي واحفظ أذكارك وتفاعلاتك عبر حسابك.'
                : 'سجّل دخولك لمزامنة أذكارك، مواقيت صلواتك، ومحادثاتك.'}
            </p>

            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-300 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {isRegisterMode && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      الاسم الكامل
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="مثال: احمد بصافي"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2 pl-9 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      اسم المستخدم (Handle)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: ahmed_bessafi"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-900 dark:text-stone-100"
                    />
                  </div>

                  {/* Avatar Picker & Phone Gallery Upload */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                        الصورة الشخصية
                      </label>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <Upload className="w-3 h-3" />
                        <span>من معرض الهاتف</span>
                      </button>
                    </div>

                    {/* Gallery upload preview box */}
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 mb-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={selectedAvatar}
                          alt="avatar"
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500 shadow-sm"
                        />
                        <div>
                          <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                            {customAvatarUploaded ? 'صورتك من معرض الهاتف' : 'الصورة المختارة'}
                          </div>
                          <div className="text-[10px] text-stone-500 dark:text-stone-400">
                            {customAvatarUploaded ? 'تم تجهيز صورتك الخاصة' : 'اختر أدناه أو ارفع من معرض هاتفك'}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>رفع صورة</span>
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Pre-made avatar choices */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                      {DEFAULT_AVATARS.map((av, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedAvatar(av);
                            setCustomAvatarUploaded(false);
                          }}
                          className={`relative w-9 h-9 rounded-full overflow-hidden border-2 transition-transform active:scale-90 shrink-0 ${
                            selectedAvatar === av && !customAvatarUploaded
                              ? 'border-emerald-500 scale-105 shadow-md'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={av} alt="avatar" className="w-full h-full object-cover" />
                          {selectedAvatar === av && !customAvatarUploaded && (
                            <span className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 text-white" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2 pl-9 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2 pl-9 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>{isRegisterMode ? 'إنشاء الحساب والتأكيد' : 'تسجيل الدخول'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick 1-tap demo login */}
            <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 text-center">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>دخول سريع فوري كـ « احمد بصافي » (حساب تجريبي)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setError(null);
                }}
                className="mt-3 text-xs text-stone-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium block mx-auto underline"
              >
                {isRegisterMode
                  ? 'لديك حساب بالفعل؟ سجّل دخولك من هنا'
                  : 'ليس لديك حساب؟ افتح حساباً جديداً'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
