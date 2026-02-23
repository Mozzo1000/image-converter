import { Download, X, CheckCircle } from 'lucide-preact';

export default function FileCard({ file, onRemove }) {
  const isDone = file.status === 'completed';
  
  return (
    <div class="p-4 bg-zinc-50 dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center gap-4 hover:scale-[1.01] transition-all">
      <div class="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
        <img src={file.preview} class="w-full h-full object-cover" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <p class="truncate text-sm font-medium">{file.file.name}</p>
          
          {/* STATUS BADGE */}
          <span class={`
            text-[9px] font-bold tracking-[0.15em] uppercase px-1.5 py-0.5 rounded-md border
            ${isDone 
              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 border-transparent' 
              : 'text-zinc-400 border-zinc-200 dark:border-zinc-800 bg-transparent'}
          `}>
            {file.status}
          </span>
        </div>

        <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
          {(file.file.size / 1024).toFixed(1)} KB
        </p>
      </div>
      <div class="flex items-center gap-2">
        {isDone ? (
          <a href={file.result} download={`conv-${file.file.name}`} class="p-2 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 rounded-xl hover:bg-white dark:hover:bg-zinc-800">
            <Download size={16} />
          </a>
        ) : (
          <button onClick={() => onRemove(file.id)} class="p-2 text-zinc-400 hover:text-red-500">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}