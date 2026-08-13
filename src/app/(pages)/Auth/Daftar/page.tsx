"use client";
import { useRandomId } from "@/app/hooks/getRandomId";
import { supabase } from "@/lib/supabase/data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import FormAuth from "@/layout/formAuth/content";
import FloatingLabel from "@/components/global/floatingLabel/content";
import {
  AtSign,
  KeyRound,
  Loader2,
  Repeat,
  School,
  UserRound,
} from "lucide-react";
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
  const { push } = useRouter();
  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputRegister>({
    resolver: zodResolver(inputRegisterSchema),
  });

  async function onSubmit(data: InputRegister) {
    const dataRegister = {
      fullName: data.nama,
      classes: data.kelas,
      email: data.email,
      password: data.password,
      role: "pelajar",
      idStudent: useRandomId(7, "STD"),
      typeAccount: "default",
    };
    try {
      const { data: existingAccount, error: checkError } = await supabase
        .from("account-student")
        .select("email")
        .eq("email", data.email)
        .limit(1);

      if (checkError) {
        toast("Gagal ❌", {
          description: "Terjadi kesalahan saat mengecek email",
        });
        return;
      }

      if (existingAccount.length > 0) {
        toast("Gagal ❌", {
          description: "Email sudah terdaftar. Gunakan email yang berbeda.",
        });
        return;
      }

      const { error: insertError } = await supabase
        .from("account-student")
        .insert(dataRegister);

      if (insertError) {
        toast("Gagal ❌", {
          description: "Gagal membuat akun",
        });
        return;
      }

      push("/Auth/Login");

      toast("Berhasil ✅", {
        description: "Berhasil membuat akun. Silakan login.",
      });
    } catch (err) {
      toast("Gagal ❌", {
        description: "Error fetch api",
      });
    }
  }

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
          type="submit"
          className="bg-blue-400 rounded-md h-10 mt-3 text-slate-50 tracking-wide font-semibold cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            "Buat Akun"
          )}
        </Button>
      </form>
    </FormAuth>
  );
}
