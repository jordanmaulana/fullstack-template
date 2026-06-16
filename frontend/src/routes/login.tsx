import { createFileRoute } from "@tanstack/react-router";

import { LoginCard } from "@/features/auth/components/login-card";

export const Route = createFileRoute("/login")({
  component: () => (
    <div className="flex min-h-screen items-center justify-center px-4">
      <LoginCard />
    </div>
  ),
});
