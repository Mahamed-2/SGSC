"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/store/useStore";
import { authApi } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { AlertCircle } from "lucide-react";

export function LoginForm() {
  const t = useTranslations("auth");
  const { setAuth } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Submit Credentials
      const response = await authApi.login({
        email: identifier,
        password: password,
      });

      // MFA required flag might be checked here
      const requiresMfa = true; // Hardcoded for Saudi UX requirement placeholder

      if (requiresMfa) {
        setStep("mfa");
      } else {
        completeLogin(response);
      }
    } catch (err: any) {
      // We expect the backend to return localized message arrays in API response, or we fallback
      setError(err.message || t("errors.invalidCredentials", { defaultMessage: "Invalid credentials" }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 2. Submit MFA - In reality this would be an API call like authApi.verifyMfa
      if (mfaCode.length !== 6) {
        throw new Error(t("errors.invalidMfa", { defaultMessage: "Invalid MFA Code" }));
      }

      // Mock completion because real backend MFA endpoint doesn't exist yet via our specs
      completeLogin({
        token: "mock-jwt-token",
        user: { id: "1", name: "Ahmed", role: "ClubAdmin", clubId: "1", email: identifier }
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const completeLogin = (data: any) => {
    setAuth(data.user, data.token);
    
    // Redirect based on role
    if (data.user?.role === "Coach") {
      router.push("/training");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center rtl:text-right">
        <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--color-brand-primary))]">
          {step === "credentials" ? "تسجيل الدخول" : "التحقق بخطوتين"}
        </h1>
        <p className="text-muted-foreground">
          {step === "credentials"
            ? "الرجاء إدخال البريد الإلكتروني أو رقم الجوال والمحاولة"
            : "أدخل الرمز المكون من 6 أرقام المرسل إلى جوالك"}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === "credentials" ? (
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">البريد الإلكتروني أو رقم الجوال</Label>
            <Input
              id="identifier"
              type="text"
              placeholder="name@domain.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={isLoading}
              dir="ltr"
              className="rtl:text-right"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">كلمة المرور</Label>
              <a href="#" className="text-sm font-medium text-[hsl(var(--color-brand-primary))] hover:underline">
                نسيت كلمة المرور؟
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              dir="ltr"
            />
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <Label htmlFor="remember" className="font-normal cursor-pointer">
              تذكرني في المرة القادمة
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "جاري الدخول..." : "دخول"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleMfaSubmit} className="space-y-4">
          <div className="space-y-2 text-center">
            <Label htmlFor="mfa">رمز التحقق</Label>
            <Input
              id="mfa"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="123456"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
              required
              disabled={isLoading}
              className="text-center text-2xl tracking-[0.5em] h-14"
              dir="ltr"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading || mfaCode.length !== 6}>
            {isLoading ? "جاري التحقق..." : "تأكيد واستمرار"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep("credentials")}
            disabled={isLoading}
            className="w-full"
          >
            العودة للخلف
          </Button>
        </form>
      )}
    </div>
  );
}
