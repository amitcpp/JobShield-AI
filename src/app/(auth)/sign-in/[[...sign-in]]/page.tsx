import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500",
          card: "bg-gray-900 border border-white/10",
          headerTitle: "text-white",
          headerSubtitle: "text-gray-400",
          socialButtonsBlockButton:
            "bg-gray-800 border-white/10 text-white hover:bg-gray-700",
          formFieldLabel: "text-gray-300",
          formFieldInput: "bg-gray-800 border-white/10 text-white",
          footerActionLink: "text-indigo-400 hover:text-indigo-300",
          identityPreviewEditButton: "text-indigo-400",
        },
      }}
    />
  );
}
