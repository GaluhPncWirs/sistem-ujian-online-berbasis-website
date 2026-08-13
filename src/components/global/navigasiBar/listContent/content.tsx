import Link from "next/link";

export default function ListContent() {
  return (
    <>
      <Link
        href="/Introduction"
        className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
      >
        Beranda
      </Link>
      <Link
        href="/HowToUse"
        className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
      >
        Cara Pakai
      </Link>
    </>
  );
}
