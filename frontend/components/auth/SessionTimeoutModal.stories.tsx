import type { Meta, StoryObj } from "@storybook/react";
import { SessionTimeoutModal } from "./SessionTimeoutModal";
import { NextIntlClientProvider } from "next-intl";

const messages = {
  auth: {
    sessionTimeoutTitle: "تنبيه: انتهاء الجلسة قريباً",
    sessionTimeoutDesc: "ستنتهي جلستك خلال {seconds} ثانية بسبب عدم النشاط لضمان حماية بياناتك.",
    signOut: "تسجيل الخروج",
    continueSession: "متابعة الجلسة",
  },
};

const meta = {
  title: "Auth/SessionTimeoutModal",
  component: SessionTimeoutModal,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="ar-SA" messages={messages}>
        <div dir="rtl" className="w-[600px] h-[400px] bg-slate-100 flex items-center justify-center p-4">
          <p className="text-muted-foreground">Background context...</p>
          <Story />
        </div>
      </NextIntlClientProvider>
    ),
  ],
} satisfies Meta<typeof SessionTimeoutModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    remainingSeconds: 60,
    onContinue: () => console.log("Continue clicked"),
    onLogout: () => console.log("Logout clicked"),
  },
};

export const Critical: Story = {
  args: {
    isOpen: true,
    remainingSeconds: 5,
    onContinue: () => console.log("Continue clicked"),
    onLogout: () => console.log("Logout clicked"),
  },
};
