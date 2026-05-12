import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";

import { useGoogleSignIn } from "@/features/auth/hooks";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (resp: { credential: string }) => void;
          }) => void;
          renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export function GoogleSignInCard() {
  const ref = useRef<HTMLDivElement>(null);
  const signIn = useGoogleSignIn();
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !window.google || !ref.current) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: ({ credential }) =>
        signIn.mutate(credential, {
          onSuccess: () => navigate({ to: "/dashboard" }),
          onError: (err) => toast.error(err instanceof Error ? err.message : "Sign-in failed"),
        }),
    });
    window.google.accounts.id.renderButton(ref.current, {
      type: "standard",
      theme: "outline",
      size: "large",
    });
  }, [clientId, signIn, navigate]);

  return (
    <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <p className="mt-1 text-sm text-slate-600">Continue with Google.</p>
      <div ref={ref} className="mt-6 flex justify-center" />
      {!clientId && (
        <p className="mt-4 text-xs text-red-600">VITE_GOOGLE_CLIENT_ID not set.</p>
      )}
    </div>
  );
}
