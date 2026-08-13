import { LucideIcon } from "lucide-react";

type CompAlurUjianProps = {
  step: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  reverse?: boolean;
};

export default function AlurUjian({
  step,
  title,
  description,
  Icon,
  reverse = false,
}: CompAlurUjianProps) {
  return (
    <div
      className={`relative flex items-start gap-5 sm:grid sm:grid-cols-2 sm:gap-10 ${
        reverse ? "sm:text-right" : ""
      }`}
    >
      {/* Mobile / Left Number */}
      <div className="relative z-10 flex shrink-0 flex-col items-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
        <div className="flex size-12 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-200">
          {step}
        </div>
      </div>

      {/* Content */}
      <div
        className={`ml-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 sm:col-span-1 sm:ml-0 ${
          reverse ? "sm:col-start-2" : "sm:col-start-1"
        }`}
      >
        <div
          className={`flex flex-col gap-4 ${
            reverse ? "sm:items-end" : "sm:items-start"
          }`}
        >
          {/* Icon */}
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Icon className="size-6" />
          </div>

          {/* Step label */}
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
            Step {step}
          </span>

          {/* Title */}
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h3>

          {/* Description */}
          <p
            className={`text-base leading-7 text-slate-500 ${
              reverse ? "sm:text-right" : "sm:text-left"
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
