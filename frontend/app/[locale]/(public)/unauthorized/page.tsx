import { Button } from "@/components/ui/Button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function UnauthorizedPage() {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 flex-col text-center space-y-6">
      <div className="rounded-full bg-red-100 p-6 dark:bg-red-900/20 text-red-600 dark:text-red-400">
        <ShieldAlert className="h-16 w-16" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("unauthorized", { defaultMessage: "وصول غير مصرح" })}
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          عذراً، لا تملك الصلاحيات اللازمة للوصول إلى هذه الصفحة. يرجى التواصل مع مدير النظام إذا كنت تعتقد أن هذا خطأ.
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button asChild variant="outline">
          <Link href="/login">العودة لتسجيل الدخول</Link>
        </Button>
        <Button asChild>
          <Link href="/">الرئيسية</Link>
        </Button>
      </div>
    </div>
  );
}
