import { LoginForm } from "@/components/auth/LoginForm";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("auth");

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden rtl:flex-row-reverse">
      
      {/* Branding Side (Hidden on smaller screens) */}
      <div className="hidden lg:flex w-1/2 bg-[hsl(var(--color-brand-primary))] text-white flex-col justify-center items-center p-12 relative">
        <div className="z-10 text-center max-w-lg space-y-6 space-y-reverse">
          <h2 className="text-4xl font-bold">كلوب أو إس</h2>
          <p className="text-xl opacity-90 leading-relaxed">
            المنصة التقنية الأولى لإدارة الأكاديميات الرياضية باحترافية وتوافق كامل مع المعايير السعودية.
          </p>
        </div>
        
        {/* Decorative elements representing dark gold/branded tech theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[hsl(var(--color-brand-secondary))]/50 to-transparent pointer-events-none" />
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10 w-full lg:w-1/2">
        <div className="absolute top-8 right-8 rtl:left-8 rtl:right-auto">
          {/* Logo or secondary nav can go here */}
          <span className="text-[hsl(var(--color-brand-primary))] font-bold text-2xl lg:hidden">
            ClubOS
          </span>
        </div>
        
        <LoginForm />
        
      </div>
    </div>
  );
}
