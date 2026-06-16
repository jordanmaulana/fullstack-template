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

export function GoogleButton() {
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
          onError: (err) =>
            toast.error(err instanceof Error ? err.message : "Sign-in failed"),
        }),
    });
    window.google.accounts.id.renderButton(ref.current, {
      type: "standard",
      theme: "outline",
      size: "large",
    });
  }, [clientId, signIn, navigate]);

  if (!clientId) {
    return (
      <p className="text-xs text-red-600">VITE_GOOGLE_CLIENT_ID not set.</p>
    );
  }
  return <div ref={ref} className="flex justify-center" />;
}
