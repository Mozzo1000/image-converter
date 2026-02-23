import { Upload } from 'lucide-preact';

export default function Dropzone({ onSelect, inputRef }) {
  return (
    <div class="group relative mb-10">
      <div class="relative border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center transition-all duration-300 group-hover:border-zinc-400 dark:group-hover:border-zinc-600 bg-zinc-50/30 dark:bg-[#18181B]/30">
        
        {/* Hidden Input Layer */}
        <input 
          type="file" 
          multiple 
          onChange={onSelect} 
          class="absolute inset-0 opacity-0 cursor-pointer z-10" 
          accept="image/*"
          ref={inputRef}
        />

        {/* Visual Content */}
        <div class="flex flex-col items-center pointer-events-none">
          <Upload 
            class="mb-4 text-zinc-400 group-hover:scale-110 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-all duration-300" 
            size={32} 
          />
          
          {/* Metadata/Label Style */}
          <p class="text-[12px] font-bold tracking-[0.1em] uppercase mb-2">
            Upload Images
          </p>
          
          <p class="text-zinc-500 text-sm text-center max-w-[240px]">
            Drag and drop images or click to browse. 
            <span class="block mt-1 text-[10px] opacity-70">
              Supports PNG, JPEG, WEBP
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}