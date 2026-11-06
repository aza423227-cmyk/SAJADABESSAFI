import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Story } from '../types';

interface StoryBarProps {
  stories: Story[];
  onSelectStory: (storyIndex: number) => void;
  onCreateStory: () => void;
}

export default function StoryBar({ stories, onSelectStory, onCreateStory }: StoryBarProps) {
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  return (
    <div className="w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md py-3 px-3 sm:px-4">
      <div className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth">
        {/* User's Create Story circle */}
        <button
          onClick={onCreateStory}
          className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full"
          aria-label="Créer un rappel ou une story"
        >
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2px] bg-stone-100 dark:bg-stone-800 border border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
            <div className="w-full h-full rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 text-white rounded-full p-1 shadow-md border-2 border-white dark:border-stone-900">
              <Plus className="w-3 h-3 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 max-w-[68px] truncate text-center font-arabic">
            قصة جديدة
          </span>
        </button>

        {/* Stories list */}
        {stories.map((story, index) => {
          const hasError = imageError[story.id];
          return (
            <button
              key={story.id}
              onClick={() => onSelectStory(index)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full transition-transform active:scale-95"
              aria-label={`Ouvrir la story ${story.title}`}
            >
              <div
                className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2.5px] transition-all group-hover:scale-105 ${
                  story.isViewed
                    ? 'bg-stone-300 dark:bg-stone-700'
                    : 'bg-gradient-to-tr from-amber-500 via-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/20'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden p-[2px] bg-white dark:bg-stone-900">
                  {!hasError && story.coverImage ? (
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      referrerPolicy="no-referrer"
                      onError={() => setImageError((prev) => ({ ...prev, [story.id]: true }))}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-emerald-800 flex items-center justify-center text-emerald-100 font-semibold text-xs">
                      {story.category.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              <span
                className={`text-[11px] max-w-[70px] truncate text-center tracking-tight ${
                  story.isViewed
                    ? 'font-normal text-stone-500 dark:text-stone-400'
                    : 'font-semibold text-stone-800 dark:text-stone-200'
                }`}
              >
                {story.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
