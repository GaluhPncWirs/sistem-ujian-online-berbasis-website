import { LucideIcon } from "lucide-react";
import Image from "next/image";

type propsFeature = {
  Icon: LucideIcon;
  titleFeature: string;
  descFeature: string;
};

export default function FiturUnggulan(props: propsFeature) {
  const { Icon, titleFeature, descFeature } = props;

  return (
    <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50">
      {/* Image */}
      <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-blue-50 transition-colors duration-300 group-hover:bg-blue-100">
        <Icon className="size-10 object-contain transition-transform duration-300 group-hover:scale-110 shrink-0" />
      </div>

      {/* Content */}
      <div>
        <h3 className="text-xl font-bold tracking-tight text-slate-900">
          {titleFeature}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-500">{descFeature}</p>
      </div>

      {/* Bottom Accent */}
      <div className="mt-auto pt-6">
        <div className="h-1 w-10 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-16" />
      </div>
    </div>
  );
}
