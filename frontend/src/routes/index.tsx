import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Welcome</h1>
        <p className="mt-2 text-sm text-slate-600">Loading...</p>
      </div>
    </div>
  ),
});
