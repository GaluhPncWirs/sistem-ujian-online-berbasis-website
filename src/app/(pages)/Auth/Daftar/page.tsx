"use client";
import { useRandomId } from "@/app/hooks/getRandomId";
import { useHandleInput } from "@/app/hooks/getHandleInput";
import { supabase } from "@/lib/supabase/data";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FormButton from "@/components/local/authFormInput/formButton/content";
import FormAuth from "@/layout/formAuth/content";
import FloatingLabel from "@/components/global/floatingLabel/content";
import { AtSign, KeyRound, Repeat, School2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterAccount() {
  const [clearForm, setClearForm] = useState(false);
  const { formMustFilled, setFormMustFilled, handleValueInput, isFormFilled } =
    useHandleInput({
      fullname: "",
      kelas: "",
      email: "",
      password: "",
    });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { push } = useRouter();

  async function handleRegister(e: any) {
    e.preventDefault();
    const dataRegister = {
      fullName: e.target.fullname.value,
      classes: e.target.kelas.value,
      email: e.target.email.value,
      password: e.target.password.value,
      role: "pelajar",
      idStudent: useRandomId(7, "STD"),
      typeAccount: "default",
    };
    try {
      setIsLoading(true);
      const { data, error }: any = await supabase
        .from("account-student")
        .select("email")
        .eq("email", e.target.email.value)
        .single();
      if (data) {
        toast("Gagal ❌", {
          description: "Nama Email Sudah Ada. Buat kembali Yang Berbeda",
        });
        setClearForm(true);
      } else if (error) {
        toast("Data Gagal Diload");
      } else {
        const { error }: any = await supabase
          .from("account-student")
          .insert(dataRegister);
        if (error) {
          toast("Gagal ❌", {
            description: "Gagal Membuat Akun",
          });
        } else {
          setIsLoading(true);
          push("/Autentikasi/Login");
          toast("Berhasil ✅", {
            description: "Berhasil Membuat Akun Silahkan Kembali Ke Form Login",
          });
        }
      }
    } catch (err) {
      setIsLoading(false);
      console.error("gagal register", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (clearForm) {
      setFormMustFilled({
        fullname: "",
        kelas: "",
        email: "",
        password: "",
      });
    }
  }, [clearForm]);

  return (
    <FormAuth formTitle={"Buat Akun"}>
      <form className="flex flex-col gap-5" onSubmit={(e) => handleRegister(e)}>
        {/* nama */}
        <FloatingLabel
          type="text"
          id="nama"
          label="Nama"
          placeholder=" "
          Icon={UserRound}
        />

        {/* kelas */}
        <FloatingLabel
          type="text"
          id="kelas"
          label="Kelas"
          placeholder=" "
          Icon={School2}
        />

        {/* email */}
        <FloatingLabel
          type="email"
          id="email"
          label="Email"
          placeholder=" "
          Icon={AtSign}
        />

        {/* password */}
        <FloatingLabel
          type="password"
          id="password"
          label="Password"
          placeholder=" "
          Icon={KeyRound}
        />

        {/* repeat password */}
        <FloatingLabel
          type="password"
          id="ulangiPassword"
          label="Ulangi Password"
          placeholder=" "
          Icon={Repeat}
        />

        {/* register button */}

        <Button
          variant="outline"
          className="bg-blue-400 rounded-md h-10 mt-3 text-slate-50 tracking-wide font-semibold cursor-pointer"
        >
          Buat Akun
        </Button>
      </form>
    </FormAuth>
  );
}
