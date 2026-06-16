import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

import {
  emailLogin,
  googleSignIn,
  logout,
  me,
  register,
} from "@/features/auth/api";
import { tokenAtom, userAtom } from "@/features/auth/state";

export function useMe() {
  const [token] = useAtom(tokenAtom);
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: me,
    enabled: !!token,
  });
}

export function useGoogleSignIn() {
  const [, setToken] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);
  return useMutation({
    mutationFn: googleSignIn,
    onSuccess: (res) => {
      setToken(res.token);
      setUser(res.user);
    },
  });
}

type Credentials = { email: string; password: string };

export function useEmailLogin() {
  const [, setToken] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);
  return useMutation({
    mutationFn: ({ email, password }: Credentials) => emailLogin(email, password),
    onSuccess: (res) => {
      setToken(res.token);
      setUser(res.user);
    },
  });
}

export function useRegister() {
  const [, setToken] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);
  return useMutation({
    mutationFn: ({ email, password }: Credentials) => register(email, password),
    onSuccess: (res) => {
      setToken(res.token);
      setUser(res.user);
    },
  });
}

export function useLogout() {
  const [, setToken] = useAtom(tokenAtom);
  const [, setUser] = useAtom(userAtom);
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setToken(null);
      setUser(null);
    },
  });
}
