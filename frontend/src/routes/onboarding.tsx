import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding")({
  component: () => (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Onboarding</h1>
        <p className="mt-2 text-sm text-slate-600">
          Optional scaffold. Unreachable while the backend reports onboarded=true
          (template default). To enable: make get_onboarded return false for new
          users, build this form to complete onboarding, then refetch me(). See
          CLAUDE.md.
        </p>
      </div>
    </div>
  ),
});
