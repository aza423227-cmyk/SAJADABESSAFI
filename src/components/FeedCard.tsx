import { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Sparkles,
  Send,
  MoreHorizontal
} from 'lucide-react';
import { FeedPost } from '../types';
import { playTasbihClickSound, playMilestoneChime, playSpiritualTone, playRealRecitation, stopAdhanPlayback } from '../services/audioService';

interface FeedCardProps {
  post: FeedPost;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onVotePoll?: (postId: string, optionId: string) => void;
  onIncrementDhikr?: (postId: string) => void;
}

export default function FeedCard({
  post,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onVotePoll,
  onIncrementDhikr
}: FeedCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [dhikrCount, setDhikrCount] = useState(post.dhikrCurrent || 0);

  const handleDoubleTap = () => {
    if (!post.isLiked) {
      onToggleLike(post.id);
    }
    setShowHeartPop(true);
    setTimeout(() => setShowHeartPop(false), 900);
  };

  const handleCopy = () => {
    const textToCopy = `${post.arabicText ? post.arabicText + '\n' : ''}${post.translation}\n— ${post.source}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAudioPlay = () => {
    if (isPlayingAudio) {
      stopAdhanPlayback();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    playRealRecitation('/audio/surat_ash_sharh.mp3', () => {
      setIsPlayingAudio(false);
    });
  };

  const handleDhikrTap = () => {
    playTasbihClickSound();
    const nextVal = dhikrCount + 1;
    setDhikrCount(nextVal);
    if (onIncrementDhikr) onIncrementDhikr(post.id);

    if (post.dhikrGoal && nextVal % post.dhikrGoal === 0) {
      playMilestoneChime();
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(post.id, newComment.trim());
    setNewComment('');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SAJADA BESSAFI - ${post.source}`,
          text: `${post.translation}\n— ${post.source}`,
          url: window.location.href
        });
      } catch {
        // dismissed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <article className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800/80 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-stone-300 dark:hover:border-stone-700/80">
      {/* 1. Header: Author & unboxed metadata */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 dark:border-stone-800/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-10 h-10 rounded-full object-cover border border-stone-200 dark:border-stone-700"
              referrerPolicy="no-referrer"
            />
            {post.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-0.5 rounded-full ring-2 ring-white dark:ring-stone-900">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                {post.authorName}
              </h3>
              <span className="text-xs text-stone-400 dark:text-stone-500">{post.authorHandle}</span>
            </div>
            {/* Unboxed metadata according to Zero-Pill rule */}
            <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
              <span>{post.category}</span>
              <span aria-hidden="true">·</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Copier le texte"
            aria-label="Copier le rappel"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onToggleSave(post.id)}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Enregistrer"
            aria-label="Enregistrer le post"
          >
            <Bookmark
              className={`w-4 h-4 ${
                post.isSaved ? 'text-amber-500 fill-amber-500' : 'text-stone-400'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 2. Visual Media (if present) */}
      {post.imageUrl && (
        <div
          className="relative w-full aspect-square sm:aspect-[4/3] bg-stone-950 overflow-hidden cursor-pointer"
          onDoubleClick={handleDoubleTap}
        >
          <img
            src={post.imageUrl}
            alt={post.source}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
            referrerPolicy="no-referrer"
          />
          {/* Double-tap floating heart */}
          {showHeartPop && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
              <Heart className="w-20 h-20 text-rose-500 fill-rose-500 drop-shadow-2xl" />
            </div>
          )}
          {/* Subtle gradient vignette at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-3 right-3 text-white text-xs flex items-center justify-between pointer-events-none">
            <span className="font-medium drop-shadow">{post.source}</span>
            <span className="text-[11px] text-stone-200 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
              Double-tape pour aimer
            </span>
          </div>
        </div>
      )}

      {/* 3. Core Text & Islamic Calligraphy */}
      <div className="p-4 sm:p-5">
        {/* Arabic Calligraphy Verse or Dua */}
        {post.arabicText && (
          <div className="mb-4 text-center sm:text-right py-2 bg-stone-50 dark:bg-stone-800/40 rounded-xl px-4 border border-stone-100 dark:border-stone-800/80">
            <p className="font-arabic text-xl sm:text-2xl text-stone-900 dark:text-amber-100/90 leading-[2.1] tracking-normal">
              {post.arabicText}
            </p>
          </div>
        )}

        {/* Transliteration toggle */}
        {post.transliteration && (
          <div className="mb-2">
            {showTransliteration && (
              <p className="text-xs italic text-stone-600 dark:text-stone-300 font-light mb-1">
                « {post.transliteration} »
              </p>
            )}
            <button
              onClick={() => setShowTransliteration((prev) => !prev)}
              className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              {showTransliteration ? 'Masquer la translittération' : 'Afficher la phonétique'}
            </button>
          </div>
        )}

        {/* Translation Prose */}
        <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 font-normal leading-relaxed mb-3">
          {post.translation}
        </p>

        {/* Source citation */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-1 pb-2 border-b border-stone-100 dark:border-stone-800">
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">{post.source}</span>
          {post.audioTitle && (
            <button
              onClick={handleAudioPlay}
              className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300 hover:text-emerald-500 transition-colors"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-emerald-500 animate-pulse' : ''}`} />
              <span className="text-[11px]">{isPlayingAudio ? 'Écoute en cours...' : 'Écouter'}</span>
            </button>
          )}
        </div>

        {/* Context / Spiritual lesson */}
        {post.context && (
          <div className="mt-3 text-xs text-stone-600 dark:text-stone-300 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-3 leading-relaxed">
            <span className="font-semibold text-emerald-800 dark:text-emerald-300">Méditation : </span>
            {post.context}
          </div>
        )}

        {/* 4. Embedded In-Feed Mini-Tasbih Counter (if dhikr post) */}
        {post.dhikrGoal && (
          <div className="mt-4 p-3 bg-stone-100/80 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                Réciter ce Dhikr dans le flux
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                Objectif : <span className="tabular-nums font-semibold">{post.dhikrGoal}</span> fois ·
                Complété : <span className="tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">{dhikrCount}</span>
              </div>
            </div>

            <button
              onClick={handleDhikrTap}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-transform cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Égrener (+1)</span>
              <span className="bg-emerald-800/80 px-2 py-0.5 rounded text-[11px] tabular-nums font-bold">
                {dhikrCount}
              </span>
            </button>
          </div>
        )}

        {/* 5. Embedded Interactive Poll (if poll post) */}
        {post.pollOptions && (
          <div className="mt-4 space-y-2">
            {post.pollQuestion && (
              <p className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                {post.pollQuestion}
              </p>
            )}
            {post.pollOptions.map((opt) => {
              const totalVotes = post.pollOptions!.reduce((acc, o) => acc + o.votes, 0) || 1;
              const percent = Math.round((opt.votes / totalVotes) * 100);
              const isSelected = post.userVotedId === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => onVotePoll && onVotePoll(post.id, opt.id)}
                  className={`relative w-full text-left p-3 rounded-xl border text-xs transition-all overflow-hidden ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  {/* Vote progress fill */}
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-500 opacity-20 ${
                      isSelected ? 'bg-emerald-500' : 'bg-stone-400 dark:bg-stone-600'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                  <div className="relative flex items-center justify-between z-10">
                    <span>{opt.text}</span>
                    <span className="tabular-nums font-semibold text-stone-600 dark:text-stone-300">
                      {percent}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Footer Actions Bar (Like, Comment, Share) */}
      <div className="px-4 py-3 bg-stone-50/60 dark:bg-stone-900/50 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onToggleLike(post.id)}
            className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 hover:text-rose-500 active:scale-95 transition-transform"
            aria-label="Aimer le post"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                post.isLiked ? 'text-rose-500 fill-rose-500' : 'text-stone-600 dark:text-stone-300'
              }`}
            />
            <span className="tabular-nums font-semibold">{post.likes}</span>
          </button>

          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 hover:text-emerald-500 transition-colors"
            aria-label="Commentaires"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="tabular-nums font-semibold">{post.commentsCount}</span>
          </button>

          <button
            onClick={handleShare}
            className="p-1 text-stone-600 dark:text-stone-300 hover:text-emerald-500 transition-colors"
            aria-label="Partager ce rappel"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
        >
          {copied ? '✓ Copié' : 'Partager la citation'}
        </button>
      </div>

      {/* 7. Comments Drawer / Section */}
      {showComments && (
        <div className="px-4 py-3 bg-stone-50 dark:bg-stone-950/60 border-t border-stone-200 dark:border-stone-800">
          <h4 className="text-xs font-semibold text-stone-800 dark:text-stone-200 mb-2">
            Réflexions de la communauté ({post.comments.length})
          </h4>

          <div className="space-y-2.5 max-h-48 overflow-y-auto no-scrollbar pr-1 mb-3">
            {post.comments.length === 0 ? (
              <p className="text-xs text-stone-400 italic">Soyez le premier à partager une réflexion.</p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                  <img
                    src={comment.avatar}
                    alt={comment.author}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    referrerPolicy="no-referrer"
                  />
                  <div className="bg-white dark:bg-stone-800 p-2.5 rounded-xl flex-1 border border-stone-200/60 dark:border-stone-700/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        {comment.author}
                      </span>
                      <span className="text-[10px] text-stone-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Écrire une pensée ou une du'a..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl transition-all"
              aria-label="Envoyer le commentaire"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
