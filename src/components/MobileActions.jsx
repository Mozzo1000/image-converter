import { ImageIcon, Play, Loader2 } from 'lucide-preact';

export default function MobileActions({ 
  onConvert, 
  onOpenFormat, 
  canConvert, 
  isConverting 
}) {
  return (
    <div class="md:hidden fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-center">
      {/* CONVERT FAB (Top) */}
      <button 
        onClick={onConvert}
        disabled={!canConvert}
        aria-label="Start Conversion"
        class={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 ${
          !canConvert 
          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 border border-zinc-200 dark:border-zinc-700' 
          : 'bg-black dark:bg-white text-white dark:text-black shadow-zinc-400/20'
        }`}
      >
        {isConverting ? (
          <Loader2 size={24} class="animate-spin" />
        ) : (
          <Play size={24} fill="currentColor" />
        )}
      </button>

      {/* FORMAT FAB (Bottom) */}
      <button 
        onClick={onOpenFormat} 
        aria-label="Change Format"
        class="w-14 h-14 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-transform"
      >
        <ImageIcon size={24} />
      </button>
    </div>
  );
}