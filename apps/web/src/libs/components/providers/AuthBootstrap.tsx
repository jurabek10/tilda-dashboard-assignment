"use client";

import { useMe } from "@/libs/hooks/useAuth";

export function AuthBootstrap() {
  useMe();
  return null;
}
