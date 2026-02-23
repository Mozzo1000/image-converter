import { Sun, Moon } from 'lucide-preact';
import { Image } from 'lucide-preact';

export default function Navbar({ theme, onToggle }) {
  return (
    <nav class="fixed top-0 w-full z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-[#09090B]/50 backdrop-blur-md">
      <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* System Label Style */}
        <div class="flex items-center gap-2">
          <Image className="h-6 w-6 text-foreground sm:h-7 sm:w-7" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-2xl">
                Image Converter
            </h1>
        </div>

        {/* Theme Toggle - Standard Ghost Style */}
        <button 
          onClick={onToggle} 
          aria-label="Toggle Theme"
          class="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:scale-105 hover:border-zinc-400 dark:hover:border-zinc-500 transition-all duration-300"
        >
          {theme === 'dark' ? (
            <Sun size={22} class="text-zinc-100" />
          ) : (
            <Moon size={22} class="text-zinc-900" />
          )}
        </button>
      </div>
    </nav>
  );
}