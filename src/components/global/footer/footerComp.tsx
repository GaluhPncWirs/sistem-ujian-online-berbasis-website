import Image from "next/image";
import Link from "next/link";

export default function FooterComponent() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image
              src="/img/global/logo.png"
              alt="ExamOnline"
              width={500}
              height={500}
              className="w-56 object-contain object-left"
            />

            <p className="mt-4 max-w-md text-base leading-7 text-slate-500">
              Platform ujian online yang dirancang untuk memberikan pengalaman
              mengerjakan ujian yang mudah, cepat, dan nyaman.
            </p>

            <div className="mt-5 inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              Ujian Tanpa Ribet, Hasil Lebih Akurat
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Navigasi
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              <Link
                href="/"
                className="w-fit text-sm text-slate-500 transition-colors hover:text-blue-600"
              >
                Beranda
              </Link>

              <Link
                href="#content"
                className="w-fit text-sm text-slate-500 transition-colors hover:text-blue-600"
              >
                Fitur Unggulan
              </Link>

              <Link
                href="#system-preview"
                className="w-fit text-sm text-slate-500 transition-colors hover:text-blue-600"
              >
                Tampilan Sistem
              </Link>

              <Link
                href="#alur-ujian"
                className="w-fit text-sm text-slate-500 transition-colors hover:text-blue-600"
              >
                Alur Ujian
              </Link>
            </nav>
          </div>

          {/* Bantuan */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Bantuan
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              <Link
                href="/cara-pakai"
                className="w-fit text-sm text-slate-500 transition-colors hover:text-blue-600"
              >
                Cara Pakai
              </Link>

              <Link
                href="/faq"
                className="w-fit text-sm text-slate-500 transition-colors hover:text-blue-600"
              >
                FAQ
              </Link>

              <Link
                href="/contact"
                className="w-fit text-sm text-slate-500 transition-colors hover:text-blue-600"
              >
                Hubungi Kami
              </Link>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-slate-200" />

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ExamOnline. All rights reserved.</p>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-blue-600"
            >
              Kebijakan Privasi
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-blue-600"
            >
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
