export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#09090B]">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm tracking-tight text-gray-500 dark:text-zinc-500">
            <p className="m-0">
              Created by <span className="font-bold text-gray-900 dark:text-zinc-100"><a className="font-bold text-gray-900 dark:text-zinc-100 hover:text-black dark:hover:text-white underline decoration-gray-300 dark:decoration-zinc-700 underline-offset-4 hover:decoration-black dark:hover:decoration-white transition-all duration-200" href="https://andreasbackstrom.se" target="_blank">Andreas Backström</a></span>
            </p>
          </div>
      </div>
    </footer>
  );
}