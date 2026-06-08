import {
  faHeartPulse,
  faRightFromBracket,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useMemo } from "react";
import { useAuthStore } from "@/modules/auth/store/authStore";

import type { SidebarRoute } from "@/shared/types/sidebar/sidebarRoute";

import AppSidebarItem from "./AppSidebarItem";
import AppSidebarDropdown from "./AppSidebarDropdown";
import { useLogout } from "@/modules/auth/hooks/useLogout";

type Props = {
  title: string;
  subtitle: string;
  routes: SidebarRoute[];
  open: boolean;
  onClose: () => void;
};

const AppSidebar = ({
  title,
  subtitle,
  routes,
  open,
  onClose,
}: Props) => {
  
  const { mutate: logout } = useLogout();

  const permissions =
    useAuthStore(
      (state) => state.user?.permissions
    );

  const permissionNames = useMemo(
    () =>
      permissions?.map(
        (p) => p.permissionName
      ) ?? [],
    [permissions]
  );

  const canAccessRoute = (
    routePermissions?: string[]
  ) => {
    if (
      !routePermissions ||
      routePermissions.length === 0
    ) {
      return true;
    }

    return routePermissions.every(
      (permission) =>
        permissionNames.includes(
          permission
        )
    );
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity
          ${
            open
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
      />

      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          h-screen
          w-72
          bg-slate-900
          text-white
          flex
          flex-col
          border-r
          border-slate-800
          transition-transform
          duration-300
          ${
            open
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div
          className="
            h-20
            flex
            items-center
            justify-between
            px-6
            border-b
            border-slate-800
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                w-11
                h-11
                rounded-2xl
                bg-cyan-500
                flex
                items-center
                justify-center
                shadow-lg
              "
            >
              <FontAwesomeIcon
                icon={faHeartPulse}
                className="text-white text-xl"
              />
            </div>

            <div>
              <h1 className="font-bold text-lg leading-none">
                {title}
              </h1>

              <p className="text-slate-400 text-sm mt-1">
                {subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              lg:hidden
              w-10
              h-10
              rounded-xl
              hover:bg-slate-800
            "
          >
            <FontAwesomeIcon
              icon={faXmark}
            />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-auto">
          {routes.map((route) => {
            if (!route.showInSidebar) {
              return null;
            }

            if (route.children) {
              const allowedChildren =
                route.children.filter(
                  (child) =>
                    child.showInSidebar !== false &&
                    canAccessRoute(
                      child.permissions
                    )
                );

              if (
                allowedChildren.length === 0
              ) {
                return null;
              }

              return (
                <AppSidebarDropdown
                  key={
                    route.label ??
                    route.path
                  }
                  label={
                    route.label ?? ""
                  }
                  icon={route.icon}
                  routes={
                    allowedChildren
                  }
                />
              );
            }

            if (
              !route.path ||
              !canAccessRoute(
                route.permissions
              )
            ) {
              return null;
            }

            return (
              <AppSidebarItem
                key={route.path}
                to={route.path}
                label={
                  route.label ?? ""
                }
                icon={route.icon}
              />
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => logout()}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              hover:bg-red-500/20
              text-red-400
              transition-all
              duration-200
            "
          >
            <FontAwesomeIcon
              icon={
                faRightFromBracket
              }
            />

            <span>
              Cerrar sesión
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;