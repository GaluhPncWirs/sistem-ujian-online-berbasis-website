import Image from "next/image";
import Link from "next/link";

export default function FooterComponent() {
  return (
    <footer className="bg-blue-100">
      <div className="pt-36 sm:pt-44 md:pt-52 lg:pt-64 grid pb-10 w-10/12 gap-10 mx-auto grid-cols-1 md:grid-cols-2">
        <div>
          <Image
            src="/img/global/logo.png"
            alt="Logo"
            width={500}
            height={500}
            className="w-72"
          />
          <p className="mt-2 font-semibold text-xl">
            Ujian Tanpa Ribet, Hasil Lebih Akurat
          </p>
        </div>

        <div>
          <div className="flex items-center gap-x-2">
            <Image
              className="size-10"
              src="/img/footer/support.png"
              alt="Jam Kerja"
              width={300}
              height={300}
            />
            <span className="font-bold text-2xl xl:text-3xl">
              Kontak & Dukungan
            </span>
          </div>
          <ul className="mt-3 text-lg">
            <li>
              Email :{" "}
              <Link
                href="mailto:loremipsum@gmail.com"
                className="hover:underline"
              >
                loremipsum@gmail.com
              </Link>
            </li>
            <li>No Telepon : 0898-2364-8262</li>
            <Link href="#">Help / FAQ</Link>
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-x-2">
            <Image
              className="size-10"
              src="/img/footer/location.png"
              alt="Alamat"
              width={300}
              height={300}
            />
            <span className="font-bold text-2xl xl:text-3xl">Alamat</span>
          </div>
          <p className="mt-3 text-lg text-justify max-w-sm">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe
            consectetur dolorum, magni dolores placeat
          </p>
        </div>

        <div>
          <div className="flex items-center gap-x-2">
            <Image
              className="size-10"
              src="/img/footer/follow.png"
              alt="Follow"
              width={300}
              height={300}
            />
            <span className="font-bold text-2xl xl:text-3xl">Follow Us</span>
          </div>
          <div className="flex flex-wrap mt-3 gap-5 text-lg">
            <Link
              href="#"
              className="flex items-center gap-3 grayscale-100 hover:grayscale-0 cursor-pointer transition-all"
            >
              <Image
                src="/img/footer/instagram.png"
                alt="instagram"
                width={200}
                height={200}
                className="size-10"
              />
              <span>Instagram</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 grayscale-100 hover:grayscale-0 cursor-pointer transition-all"
            >
              <Image
                src="/img/footer/linkedin.png"
                alt="linkedin"
                width={200}
                height={200}
                className="size-10"
              />
              <span>Linkedin</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 grayscale-100 hover:grayscale-0 cursor-pointer transition-all"
            >
              <Image
                src="/img/footer/facebook.png"
                alt="facebook"
                width={200}
                height={200}
                className="size-10"
              />
              <span>Facebook</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 grayscale-100 hover:grayscale-0 cursor-pointer transition-all"
            >
              <Image
                src="/img/footer/tiktok.png"
                alt="tiktok"
                width={200}
                height={200}
                className="size-10"
              />
              <span>Tiktok</span>
            </Link>
          </div>
        </div>
      </div>

      <div>
        <hr className="rounded-full border border-slate-400 mx-10" />
        <h1 className="py-3 w-10/12 mx-auto">
          Copyright{" "}
          <span className="text-blue-500 font-bold">
            {new Date(Date.now()).getFullYear()}
          </span>{" "}
          Galuh panca wirasa rights reserved.
        </h1>
      </div>
    </footer>
  );
}
