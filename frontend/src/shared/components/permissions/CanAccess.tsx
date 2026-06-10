import React from "react";
import { useAccess } from "@/shared/hooks/useAccess";

type CanProps = {
  role?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export default function CanAccess({
  role,
  fallback = null,
  children,
}: CanProps) {
  const allowed = useAccess({
    roles: role ? [role] : [],
  });

  return allowed ? <>{children}</> : <>{fallback}</>;
}