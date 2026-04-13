import type { Meta, StoryObj } from "@storybook/react";
import { LoginForm } from "./LoginForm";
import { NextIntlClientProvider } from "next-intl";

// Mock messages for Storybook
const messages = {
  auth: {
    errors: {
      invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      invalidMfa: "رمز التحقق غير صحيح، الرجاء المحاولة مرة أخرى",
    },
  },
};

const meta = {
  title: "Auth/LoginForm",
  component: LoginForm,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="ar-SA" messages={messages}>
        <div dir="rtl" className="w-[400px] p-4 bg-background border rounded-xl shadow-sm">
          <Story />
        </div>
      </NextIntlClientProvider>
    ),
  ],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  // Since state is internal, we'd typically mock axios or the authApi,
  // but for Storybook we can just export a visual wrapper or let the user try it.
};
