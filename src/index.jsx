import { hydrate, prerender as ssr } from 'preact-iso';
import { useState, useMemo, useEffect, useRef } from 'preact/hooks';
import { useTheme } from './hooks/useTheme';
import Navbar from './components/Navbar';
import Dropzone from './components/Dropzone';
import FormatSelector from './components/FormatSelector';
import FileCard from './components/FileCard';
import MobileActions from './components/MobileActions';
import Footer from './components/Footer';
import './style.css';

const FORMATS = [
  { label: 'PNG', mime: 'image/png' },
  { label: 'JPEG', mime: 'image/jpeg' },
  { label: 'WEBP', mime: 'image/webp' },
];

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [files, setFiles] = useState([]);
  const [targetFormat, setTargetFormat] = useState(FORMATS[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef(null);

  const clearQueue = () => {
	files.forEach(f => {
	  URL.revokeObjectURL(f.preview);
	  if (f.result) URL.revokeObjectURL(f.result);
	});
	
	setFiles([]);

	if (fileInputRef.current) {
	  fileInputRef.current.value = ""; 
	}
  }

  const handleFiles = (e) => {
	const news = Array.from(e.target.files).map(f => ({
	  id: Math.random().toString(36).substr(2, 9),
	  file: f,
	  status: 'pending',
	  preview: URL.createObjectURL(f)
	}));
	setFiles([...files, ...news]);
  };

  const processAll = async () => {
  if (files.length === 0 || isConverting) return;
  
  setIsConverting(true);
  
  // 1. Create a copy of the files array to update state
  const updatedFiles = [...files];

  try {
	for (let i = 0; i < updatedFiles.length; i++) {
	  // Only process files that aren't already done
	  if (updatedFiles[i].status === 'completed') continue;

	  updatedFiles[i].status = 'processing';
	  setFiles([...updatedFiles]); // Update UI to show "Processing" status

	  // 2. The actual conversion call
	  const resultBlobUrl = await convertFile(updatedFiles[i], targetFormat.mime);
	  
	  updatedFiles[i].result = resultBlobUrl;
	  updatedFiles[i].status = 'completed';
	  
	  // Update state incrementally so the user sees progress
	  setFiles([...updatedFiles]);
	}
  } catch (error) {
	console.error("Conversion failed:", error);
  } finally {
	setIsConverting(false);
  }
};


const convertFile = (fileObj, mimeType) => {
  return new Promise((resolve, reject) => {
	const img = new Image();
	img.onload = () => {
	  const canvas = document.createElement('canvas');
	  canvas.width = img.width;
	  canvas.height = img.height;
	  const ctx = canvas.getContext('2d');
	  
	  // Draw image to canvas
	  ctx.drawImage(img, 0, 0);
	  
	  // Convert canvas to Blob (Better for memory than DataURL)
	  canvas.toBlob((blob) => {
		if (blob) {
		  const url = URL.createObjectURL(blob);
		  resolve(url);
		} else {
		  reject(new Error("Canvas to Blob conversion failed"));
		}
	  }, mimeType, 0.9); // 0.9 is the quality setting
	};
	img.onerror = reject;
	img.src = fileObj.preview;
  });
};

  useEffect(() => {
	// If the user changes the format, we want to allow them to re-convert
	// all files to the new format.
	setFiles(prevFiles => 
	  prevFiles.map(file => ({
		...file,
		status: 'pending',
		result: null // Clear previous conversion result to save memory
	  }))
	);
  }, [targetFormat]);

  const canConvert = useMemo(() => {
	if (files.length === 0) return false;
	if (isConverting) return false;
	return files.some(f => f.status !== 'completed');
  }, [files, isConverting]);

  return (
	<div class="min-h-screen flex flex-col bg-white dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100">
	  <Navbar theme={theme} onToggle={toggleTheme} />
	  
	  <main class="flex-1 w-full md:max-w-5xl  mx-auto pt-32 px-6 ">
		<Dropzone onSelect={handleFiles} inputRef={fileInputRef} />

		<div class="flex items-center justify-between mb-6">
		  
		  {files.length > 0 && (
			<>
			  <h2 class="text-sm font-bold tracking-widest uppercase text-zinc-500">Queue ({files.length})</h2>
			  <FormatSelector 
				formats={FORMATS} 
				current={targetFormat} 
				onSelect={setTargetFormat}
				isOpen={isDrawerOpen}
				setIsOpen={setIsDrawerOpen}
			  />
			  <div className="flex items-center gap-3">
				<button onClick={clearQueue} class="flex-1 md:flex-none px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-xl text-[11px] font-bold tracking-widest uppercase hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-300">
				  Clear All
				</button>
			  <button onClick={processAll} disabled={!canConvert} className={`
	hidden md:flex px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300
	${!canConvert 
	  ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 cursor-not-allowed border border-zinc-200 dark:border-zinc-800' 
	  : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 shadow-sm'
	}
  `}>
				{isConverting ? 'Converting...' : canConvert ? `Convert (${files.length})` : "Convert"}
			  </button>
			  </div>
			</>
		  )}
		</div>

		{files.length > 0 && (
		  <MobileActions 
			onConvert={processAll}
			onOpenFormat={() => setIsDrawerOpen(true)}
			canConvert={canConvert}
			isConverting={isConverting}
		  />
		)}

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-32 md:pb-0">
		  {files.map(f => (
			<FileCard key={f.id} file={f} onRemove={(id) => setFiles(files.filter(x => x.id !== id))} />
		  ))}
		</div>
	  </main>
	  <Footer />
	</div>
  );
}


if (typeof window !== 'undefined') {
  hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
