import { useConvertDate } from "@/app/hooks/getConvertDate";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useGetDataUsers } from "@/store/useGetDataUsers/state";
import { User2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function HeaderProfile({
  children,
}: {
  children: React.ReactNode;
}) {
  const dataUser = useGetDataUsers((state) => state.dataUsers);
  const [previewImgProfil, setPreviewImgProfil] = useState<string | null>(null);

  function handleChangeImgProfile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImgProfil(URL.createObjectURL(file));
    }
  }
  return (
    <>
      {/* Profile */}
      <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Photo */}
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="group relative size-24 shrink-0 overflow-hidden rounded-full border-4 border-white/30 bg-white/10 p-1 backdrop-blur-sm sm:size-28"
            >
              {previewImgProfil !== null ? (
                <Image
                  src={previewImgProfil}
                  alt="Foto profil siswa"
                  width={300}
                  height={300}
                  className="size-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <Image
                  src="/img/global/userProfile.png"
                  alt="Foto profil siswa"
                  width={300}
                  height={300}
                  className="size-full rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}

              <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100">
                Ubah Foto
              </span>
            </button>
          </DialogTrigger>

          <DialogContent className="rounded-2xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Ubah Foto Profil
              </DialogTitle>

              <DialogDescription>
                Pilih foto baru untuk digunakan sebagai foto profil.
              </DialogDescription>
            </DialogHeader>

            <div className="pt-2">
              <Input
                type="file"
                accept="image/*"
                id="imgProfil"
                onChange={handleChangeImgProfile}
                className="rounded-xl"
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="rounded-xl">
                  Batal
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button className="rounded-xl bg-blue-600 hover:bg-blue-700">
                  Simpan
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {children}
      </div>

      {/* ================= ACCOUNT INFORMATION ================= */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <User2 className="size-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Informasi Akun
              </h2>

              <p className="text-sm text-muted-foreground">
                Informasi dasar akun siswa Anda.
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <div className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-3 sm:px-6">
            <span className="text-sm font-semibold text-slate-500">Email</span>

            <span className="text-sm font-medium text-slate-900 sm:col-span-2">
              {dataUser?.email || "-"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-3 sm:px-6">
            <span className="text-sm font-semibold text-slate-500">
              No. Telepon
            </span>

            <span className="text-sm font-medium text-slate-900 sm:col-span-2">
              {dataUser?.noTlp
                ? dataUser.noTlp.match(/.{1,4}/g)?.join("-")
                : "-"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-3 sm:px-6">
            <span className="text-sm font-semibold text-slate-500">
              Bergabung
            </span>

            <span className="text-sm font-medium text-slate-900 sm:col-span-2">
              {dataUser?.created_at
                ? useConvertDate(dataUser.created_at, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "-"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-3 sm:px-6">
            <span className="text-sm font-semibold text-slate-500">Peran</span>

            <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold capitalize text-blue-600 sm:col-span-2">
              {dataUser?.role || "-"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-3 sm:px-6">
            <span className="text-sm font-semibold text-slate-500">
              Status Akun
            </span>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 sm:col-span-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              Aktif
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
