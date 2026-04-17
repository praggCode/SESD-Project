import { SignupForm } from "@/components/signup-form";
export const metadata = {
  title: "Sign Up | Sentinel",
  description: "Create your Sentinel account to access real-time security monitoring.",
};
export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  );
}
