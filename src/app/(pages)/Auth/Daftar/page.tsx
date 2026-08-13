"use client";
import { useRandomId } from "@/app/hooks/getRandomId";
import { useHandleInput } from "@/app/hooks/getHandleInput";
import { supabase } from "@/lib/supabase/data";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FormAuth from "@/layout/formAuth/content";
import FloatingLabel from "@/components/global/floatingLabel/content";
import { AtSign, KeyRound, Repeat, School, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const inputRegisterSchema = z
  .object({
    nama: z
      .string()
      .min(2, "Nama minimal 2 karakter")
      .max(100, "Nama maksimal 100 karakter"),
    kelas: z.string().min(1, "Kelas tidak boleh kosong"),
    email: z.email().min(5, "Minimal 5 karakter"),
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(100, "Password maksimal 100 karakter"),
    ulangiPassword: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .max(100, "Password maksimal 100 karakter"),
  })
  .refine((data) => data.password === data.ulangiPassword, {
    message: "Password tidak sama",
    path: ["ulangiPassword"],
  });

type InputRegister = z.infer<typeof inputRegisterSchema>;

export default function RegisterAccount() {
  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputRegister>({
    resolver: zodResolver(inputRegisterSchema),
  });

  console.log(errors);

  async function onSubmit(data: InputRegister) {
    console.log(data);
  }

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
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        {/* nama */}
        <FloatingLabel
          type="text"
          id="nama"
          label="Nama"
          register={register("nama")}
          error={errors.nama}
          placeholder=" "
          Icon={UserRound}
        />

        {/* kelas */}
        <FloatingLabel
          type="text"
          id="kelas"
          label="Kelas"
          register={register("kelas")}
          error={errors.kelas}
          placeholder=" "
          Icon={School}
        />

        {/* email */}
        <FloatingLabel
          type="email"
          id="email"
          label="Email"
          register={register("email")}
          error={errors.email}
          placeholder=" "
          Icon={AtSign}
        />

        {/* password */}
        <FloatingLabel
          type="password"
          id="password"
          register={register("password")}
          error={errors.password}
          label="Password"
          placeholder=" "
          Icon={KeyRound}
        />

        {/* repeat password */}
        <FloatingLabel
          type="password"
          id="ulangiPassword"
          register={register("ulangiPassword")}
          error={errors.ulangiPassword}
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
