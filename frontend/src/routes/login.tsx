import { createFileRoute } from "@tanstack/react-router";

import { GoogleSignInCard } from "@/features/auth/components/google-sign-in-card";

export const Route = createFileRoute("/login")({
  component: () => (
    <div className="flex min-h-screen items-center justify-center px-4">
      <GoogleSignInCard />
    </div>
  ),
});
