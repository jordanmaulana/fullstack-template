import { createFileRoute } from "@tanstack/react-router";
import { useAtom } from "jotai";

import { userAtom } from "@/features/auth/state";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [user] = useAtom(userAtom);
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">
        Signed in as {user?.email ?? "—"}.
      </p>
    </div>
  );
}
