import { useVerifyToken } from "@/app/hooks/getVerifyToken";
import React, { useEffect } from "react";
import { useGetIdUsers } from "@/store/useGetIdUsers/state";
import { useGetDataUsers } from "@/store/useGetDataUsers/state";
import { usePathname } from "next/navigation";
import ListSidebar from "@/components/global/listSidebar/content";
import { useShallow } from "zustand/shallow";
import DialogFormAddDataUser from "@/components/global/dialogTipeAkun/content";

export default function MainContent({ children }: React.PropsWithChildren) {
  const { loadingSession, statusToken } = useVerifyToken();
  const pathName = usePathname();
  const getDataUsers = useGetDataUsers((state) => state.setGetDataUsers);
  const { setHandleGetIdUsers, idUsers, role } = useGetIdUsers(
    useShallow((state) => ({
      setHandleGetIdUsers: state.setHandleGetIdUsers,
      idUsers: state.idUser,
      role: state.role,
    })),
  );

  useEffect(() => {
    setHandleGetIdUsers();
  }, [setHandleGetIdUsers]);

  useEffect(() => {
    if (role === "pelajar") {
      getDataUsers(idUsers, "account-student", "idStudent");
    } else if (role === "pengajar") {
      getDataUsers(idUsers, "account_teacher", "id_teacher");
    }
  }, [role, idUsers, getDataUsers]);

  return (
    <div className="bg-black">
      <DialogFormAddDataUser idUsers={idUsers} />
      <div
        className={`min-h-screen bg-slate-50 ${
          loadingSession ? "pointer-events-none opacity-60" : ""
        }`}
      >
        {pathName.startsWith("/Student/Exams/StartExam") ? (
          children
        ) : (
          <div className="min-h-screen">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white md:flex md:flex-col">
              <ListSidebar />
            </aside>

            {/* Main Content */}
            <main className="min-h-screen md:ml-64">
              {/* Page Content */}
              <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
                {children}
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
