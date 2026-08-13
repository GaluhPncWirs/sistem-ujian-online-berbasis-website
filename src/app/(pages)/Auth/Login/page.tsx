"use client";
import { useHandleInput } from "@/app/hooks/getHandleInput";
import FloatingLabel from "@/components/global/floatingLabel/content";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormAuth from "@/layout/formAuth/content";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Book, GraduationCap, KeyRound } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const inputLoginSchema = z.object({
  typeAccount: z.string().min(1, "Pilih tipe akun terlebih dahulu"),
  email: z.email().min(5, "Minimal 5 karakter"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

type InputLogin = z.infer<typeof inputLoginSchema>;

export default function LoginAccount() {
  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InputLogin>({
    resolver: zodResolver(inputLoginSchema),
  });

  async function onSubmit(data: InputLogin) {
    console.log(data);
  }

  const { push } = useRouter();
  const [valueTypeAccount, setValueTypeAccount] = useState<string>("");
  const { formMustFilled, handleValueInput, isFormFilled } = useHandleInput({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valueEmail: e.currentTarget.email.value,
          valuePassword: e.currentTarget.password.value,
          valueTypeAccount: valueTypeAccount,
        }),
      });

      const dataLogin = await response.json();

      if (valueTypeAccount !== "") {
        if (dataLogin.success) {
          if (dataLogin.tipe === "siswa") {
            push("/Student/Dashboard");
            toast("Berhasil ✅", {
              description: dataLogin.message,
            });
          } else {
            push("/Teacher/dashboard");
            toast("Berhasil ✅", {
              description: dataLogin.message,
            });
          }
        } else {
          toast("Gagal ❌", {
            description: dataLogin.message,
          });
        }
      } else {
        toast("Gagal ❌", {
          description: "Jenis Akun Belum Dipilih",
        });
      }
    } catch (err) {
      setIsLoading(false);
      console.error("gagal login", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormAuth formTitle={"Login"}>
      {/* Form */}
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        {/* Account Type */}
        <Controller
          control={control}
          name="typeAccount"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                id="accountType"
                className="w-full rounded-lg border-slate-200 bg-slate-50 px-4 shadow-none transition-all focus:border-blue-500 focus:ring-blue-500"
              >
                <SelectValue placeholder="Pilih jenis akun" />
              </SelectTrigger>

              <SelectContent className="rounded-lg border-slate-200 bg-white">
                <SelectItem value="guru">
                  <GraduationCap className="size-5" /> Guru
                </SelectItem>
                <SelectItem value="siswa">
                  <Book className="size-4.5" />
                  Siswa
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Email */}
        <FloatingLabel
          type="email"
          id="email"
          label="Email"
          error={errors.email}
          register={register("email")}
          placeholder=" "
          Icon={AtSign}
        />

        {/* Password */}
        <FloatingLabel
          type="password"
          id="password"
          error={errors.password}
          register={register("password")}
          label="Password"
          placeholder=" "
          Icon={KeyRound}
        />

        {/* Login Button */}
        <Button
          variant="outline"
          className="bg-blue-400 rounded-md h-10 mt-3 text-slate-50 tracking-wide font-semibold cursor-pointer"
        >
          Masuk ke Akun
        </Button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          atau
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Google */}
      <Button
        type="button"
        onClick={() =>
          signIn("google", {
            redirect: false,
            callbackUrl: "/Student/Dashboard",
          })
        }
        variant="outline"
        className="h-12 w-full rounded-xl border-slate-200 bg-white font-semibold text-slate-700 shadow-none transition-all hover:bg-slate-50"
      >
        <svg viewBox="0 0 24 24" className="mr-2 size-5" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M21.35 12.27c0-.79-.07-1.55-.23-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
          />
          <path
            fill="#34A853"
            d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.73 9.73 0 0 0 12 21.5Z"
          />
          <path
            fill="#FBBC05"
            d="M6.54 13.58A5.84 5.84 0 0 1 6.23 12c0-.55.11-1.08.31-1.58V7.89H3.3A9.72 9.72 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.11l3.24-2.53Z"
          />
          <path
            fill="#EA4335"
            d="M12 6.39c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.5 14.63 2.5 12 2.5a9.73 9.73 0 0 0-8.7 5.39l3.24 2.53C7.31 8.11 9.46 6.39 12 6.39Z"
          />
        </svg>
        Lanjutkan dengan Google
      </Button>
    </FormAuth>
  );
}
