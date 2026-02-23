import { useState } from 'preact/hooks';
import { ImageIcon, X, ChevronDown } from 'lucide-preact';

export default function FormatSelector({ formats, current, onSelect, isOpen, setIsOpen }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div>
      {/* DESKTOP ROW LAYOUT */}
      <div class="hidden md:flex items-center gap-6">
        {/* SYSTEM LABEL - Moved to row */}
        <label class="text-[12px] font-bold tracking-widest uppercase text-zinc-500 whitespace-nowrap">
          Output Format
        </label>

        <div class="relative w-48">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            class="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium hover:border-zinc-400 dark:hover:border-zinc-600 transition-all group"
          >
            <span class="font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{current.label}</span>
            <ChevronDown 
              size={14} 
              class={`text-zinc-400 group-hover:text-zinc-600 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {isDropdownOpen && (
            <>
              {/* Click-away overlay */}
              <div class="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
              
              <div class="absolute top-full mt-2 w-full z-20 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {formats.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => {
                      onSelect(f);
                      setIsDropdownOpen(false);
                    }}
                    class={`w-full text-left px-4 py-2.5 text-[11px] font-bold tracking-widest uppercase transition-colors ${
                      current.label === f.label 
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100' 
                        : 'text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-600'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile drawer  */}
      

      {isOpen && (
        <div class="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div class="w-full bg-white dark:bg-[#09090B] rounded-t-[24px] p-8 border-t border-zinc-200 dark:border-zinc-800 animate-slide-up">
            <div class="flex justify-between items-center mb-6">
              <span class="text-[12px] font-bold tracking-widest uppercase text-zinc-500">Output Format</span>
              <button onClick={() => setIsOpen(false)} class="p-2 -mr-2"><X size={20}/></button>
            </div>
            <div class="grid grid-cols-1 gap-3 mb-4">
              {formats.map((f) => (
                <button 
                  key={f.label}
                  onClick={() => { onSelect(f); setIsOpen(false); }}
                  class={`w-full py-4 rounded-xl border text-sm font-bold tracking-widest uppercase transition-all ${
                    current.label === f.label 
                      ? 'bg-black text-white dark:bg-white dark:text-black border-transparent' 
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-500'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}