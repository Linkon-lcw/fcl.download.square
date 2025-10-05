import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center sm:items-start gap-[32px] row-start-2">
      <Image
        src="/image/FCL_icon.webp"
        alt="Fold Craft Launcher logo" 
        width={180}
        height={180}
        priority
      />
      <h1 className="font-bold text-4xl sm:text-left text-center tracking-tight">
        Fold Craft Launcher
      </h1>
      <ol className="font-mono text-sm/6 sm:text-left text-center list-decimal list-inside">
        <li className="mb-2 tracking-[-.01em]">
          从上面切换到下载页
          开始下载。
        </li>
        <li className="tracking-[-.01em]">
          或者在这里查看更多
        </li>
      </ol>

      <div className="flex sm:flex-row flex-col items-center gap-4">
        <a
          className="flex justify-center items-center gap-2 bg-[var(--primary)] hover:bg-[#383838] dark:hover:bg-[#ccc] px-4 sm:px-5 border border-transparent border-solid rounded-full sm:w-auto h-10 sm:h-12 font-medium text-background text-sm sm:text-base transition-colors"
          href="http://foldcraftlauncher.cn"
          target="_blank"
          rel="noopener noreferrer"
        >
          前往旧样式
        </a>
      </div>
    </main>
  );
}