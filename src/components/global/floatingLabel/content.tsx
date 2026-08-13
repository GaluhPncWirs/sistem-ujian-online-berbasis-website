import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";
import { HTMLInputTypeAttribute } from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type PropsFloatingLabel = {
  type: HTMLInputTypeAttribute | undefined;
  id: string;
  label: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  Icon?: LucideIcon | undefined;
  desc?: string;
  placeholder?: string;
};

export default function FloatingLabel(props: PropsFloatingLabel) {
  const { type, id, label, desc, placeholder, Icon, register, error } = props;
  return (
    <>
      <div className="relative">
        <Input
          type={type}
          id={id}
          placeholder={placeholder}
          {...register}
          className="peer h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-14 text-sm font-medium text-slate-800 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:bg-slate-50 focus:ring-4 focus:ring-blue-500/10 focus-visible:outline-none focus-visible:ring-0"
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute flex items-center gap-2 left-4 top-1/2 z-10 -translate-y-1/2 bg-slate-50 px-1 text-sm font-medium text-slate-400 transition-all duration-300 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-slate-50 peer-focus:text-xs peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:-translate-y-1/2 peer-[:not(:placeholder-shown)]:bg-slate-50 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-500"
        >
          {Icon ? <Icon className="inline size-4" /> : null} {label}
        </label>
        {desc && (
          <span className="pointer-events-none absolute right-4 top-1/2 z-10 -translate-y-1/2 text-xs font-medium text-slate-400">
            {desc}
          </span>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-0.5">{error.message}</p>}
    </>
  );
}
