import Image from "next/image";
import HeaderDashboard from "../headerDashboard/content";
import { usePathname } from "next/navigation";

type propsHeaderDahboard = {
  user: string;
  fullName: string;
  exams?: any;
};

export default function HeaderDasboard(props: propsHeaderDahboard) {
  const { user, fullName, exams } = props;
  const pathName = usePathname();
  function informExams() {
    const examList = Array.isArray(exams) ? exams : [];

    if (pathName === "/Student/Dashboard") {
      const filterSisaUjian = examList.filter(
        (done: any) => done.status_exam !== true,
      );

      return (
        <HeaderDashboard
          remainder={filterSisaUjian}
          isLocationPage={pathName}
        />
      );
    }

    const filterNilaiSiswa = examList
      .flatMap((exam: any) =>
        Array.isArray(exam.resultUjian) ? exam.resultUjian : [],
      )
      .filter((result: any) => result.hasil_ujian === "pending");

    return (
      <HeaderDashboard remainder={filterNilaiSiswa} isLocationPage={pathName} />
    );
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-sky-600 via-blue-500 to-cyan-600 p-6 text-white shadow-lg shadow-blue-100 mb-8 sm:p-8">
      {/* Decorative Circle */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-white/5" />

      <div className="relative z-10">
        {/* Page Title */}
        <div className="flex flex-col justify-center gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-100 ">
              {`${user === "Siswa" ? "Student" : "Teacher"} Dashboard`}
            </p>

            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Dashboard {user}
            </h1>
          </div>

          {informExams()}
        </div>

        {/* Welcome */}
        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
          {/* Profile Image */}
          <div className="rounded-full border-4 border-white/30 bg-white/10 p-1 backdrop-blur-sm">
            <Image
              src="/img/global/userProfile.png"
              alt="Foto profil siswa"
              width={500}
              height={500}
              className="size-20 rounded-full object-cover sm:size-24"
              priority
            />
          </div>

          {/* Greeting */}
          <div>
            <p className="text-sm font-medium text-blue-100 sm:text-base">
              Halo, selamat datang
            </p>

            <h2 className="mt-1 text-2xl font-extrabold capitalize sm:text-3xl">
              {fullName}
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-50 sm:text-base">
              {user === "Siswa"
                ? "Semoga harimu berjalan dengan baik. Yuk, lanjutkan aktivitas ujian dan capai hasil terbaikmu."
                : "Semoga harimu berjalan dengan baik. Yuk, kelola ujian, pantau hasil, dan bantu siswa mencapai hasil terbaiknya."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
