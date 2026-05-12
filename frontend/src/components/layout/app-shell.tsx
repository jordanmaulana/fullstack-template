import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useAtom } from "jotai";

import { userAtom } from "@/features/auth/state";
import { useLogout } from "@/features/auth/hooks";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard" },
];

export function AppShell() {
  const [user] = useAtom(userAtom);
  const logout = useLogout();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="flex w-60 shrink-0 flex-col justify-between bg-slate-900 text-slate-200">
        <div className="flex flex-col gap-6 px-4 py-6">
          <div className="text-lg font-semibold tracking-tight text-white">App</div>
          <nav className="flex flex-col gap-1 text-sm">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded px-3 py-2 transition",
                  pathname === item.to
                    ? "bg-blue-500/15 text-white border-l-2 border-blue-400 -ml-px pl-2.5"
                    : "text-slate-300 hover:bg-white/5",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-4 text-xs">
          {user && (
            <>
              <div className="text-slate-400">
                <div className="font-medium text-slate-200">{user.email}</div>
              </div>
              <button
                type="button"
                onClick={() => logout.mutate()}
                className="flex items-center gap-2 rounded bg-white/5 px-3 py-1.5 text-slate-200 hover:bg-white/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </>
          )}
        </div>
      </aside>
      <section className="flex-1 overflow-y-auto bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
