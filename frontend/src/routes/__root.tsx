import { createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

import { AuthGate } from "@/features/auth/components/auth-gate";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => <AuthGate />,
});
