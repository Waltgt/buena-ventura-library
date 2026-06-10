import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useAuthStore } from "@/modules/auth/store/authStore";
import type { SidebarRoute } from "@/shared/types/sidebar/sidebarRoute";
import AppSidebarItem from "./AppSidebarItem";

type Props = {
  label: string;
  icon?: IconDefinition;
  routes: SidebarRoute[];
};

const AppSidebarDropdown = ({ label, icon, routes }: Props) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const [open, setOpen] = useState(false);

  const canAccessRoute = (allowedRoles?: string[] | string) => {
    if (!allowedRoles) return true;

    const roles = Array.isArray(allowedRoles)
      ? allowedRoles
      : [allowedRoles];

    return roles.includes(user?.role.name ?? "");
  };

  const buildPath = (path?: string) => {
    if (!path) return "/admin";
    if (path.startsWith("/")) return path;
    return `/admin/${path}`;
  };

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      if (route.showInSidebar === false) return false;
      return canAccessRoute(route.allowedRoles);
    });
  }, [routes, user]);

  if (!filteredRoutes.length) return null;

  const isActiveChild = filteredRoutes.some(
    (r) => location.pathname === buildPath(r.path)
  );

  return (
    <div className="space-y-2">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          {icon && <FontAwesomeIcon icon={icon} />}
          <span className="font-medium">{label}</span>
        </div>

        <FontAwesomeIcon
          icon={faChevronDown}
          className={`transition-transform duration-200 ${
            open || isActiveChild ? "rotate-180" : ""
          }`}
        />
      </button>

      {(open || isActiveChild) && (
        <div className="ml-4 space-y-2">
          {filteredRoutes.map((route) => {
            if (!route.path) return null;

            return (
              <AppSidebarItem
                key={route.path}
                to={buildPath(route.path)}
                label={route.label ?? ""}
                icon={route.icon}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppSidebarDropdown;