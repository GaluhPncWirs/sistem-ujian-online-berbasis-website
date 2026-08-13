"use client";
import FooterComponent from "@/components/global/footer/footerComp";
import NavigasiBar from "@/components/global/navigasiBar/navbar";
import { useEffect } from "react";
import { useGetIdUsers } from "@/store/useGetIdUsers/state";

export default function Homepage({ children }: any) {
  const getidUsers = useGetIdUsers((state) => state.setHandleGetIdUsers);
  useEffect(() => {
    getidUsers();
  }, []);
  return (
    <main>
      <NavigasiBar />
      <div className="pt-14">{children}</div>
      <FooterComponent />
    </main>
  );
}
