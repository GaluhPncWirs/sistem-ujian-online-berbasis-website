import {
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  Wrench,
} from "lucide-react";

type FloatingBarDashboardTeacherProps = {
  handleClickItem: (itemId: string) => void;
  activeItem: string;
};

const menuItems = [
  {
    id: "scheduleExams",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "createQuestions",
    label: "Buat Soal",
    icon: FilePlus2,
  },
  {
    id: "viewResult",
    label: "Kelola Ujian",
    icon: Wrench,
  },
  {
    id: "manageStudent",
    label: "Nilai Siswa",
    icon: ClipboardList,
  },
];

export default function FloatingBarDashboardTeacher({
  handleClickItem,
  activeItem,
}: FloatingBarDashboardTeacherProps) {
  return (
    <div className="sticky top-4 z-20 mx-auto w-full">
      <nav className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/60">
        <ul className="flex min-w-max items-center gap-1 sm:grid sm:min-w-0 sm:grid-cols-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <li key={item.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => handleClickItem(item.id)}
                  className={`group flex w-full min-w-[110px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 sm:min-w-0 ${
                    isActive
                      ? "bg-blue-500 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-500 hover:bg-blue-50 hover:text-blue-500"
                  }`}
                >
                  <span
                    className={`flex size-9 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? "bg-white/15"
                        : "bg-slate-100 group-hover:bg-blue-100"
                    }`}
                  >
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>

                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
