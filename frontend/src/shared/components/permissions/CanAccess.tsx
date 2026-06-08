import React from "react";
import { useAccess } from "@/shared/hooks/useAccess";

type CanProps = {
  permission?: string;
  role?: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export default function CanAccess({
  permission,
  role,
  fallback = null,
  children,
}: CanProps) {
  const allowed = useAccess({
    permissions: permission ? [permission] : [],
    roles: role ? [role] : [],
  });

  return allowed ? <>{children}</> : <>{fallback}</>;
}