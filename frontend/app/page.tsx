/* eslint-disable react/jsx-no-undef */
import Image from "next/image"; 
export default function Home() {


  const userId = getCookie("userId");
  const role = getCookie("role");

  useEffect(() => {
  }, []);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center justify-center sm:justify-start">
          <a
            className="rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 text-white text-lg font-semibold py-3 px-8 transition-all transform hover:scale-105 hover:shadow-xl shadow-md flex items-center justify-center"
            href="/auth/register"
          >
            Register
          </a>

          <a
            className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 text-white text-lg font-semibold py-3 px-8 transition-all transform hover:scale-105 hover:shadow-xl shadow-md flex items-center justify-center"
            href="/auth/login"
          >
            Login
          </a>
        </div>
      </main>
    </div>
  );
}