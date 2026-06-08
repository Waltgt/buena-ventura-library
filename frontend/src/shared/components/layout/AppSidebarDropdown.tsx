import { useMemo, useState } from "react";

import {
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

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

const AppSidebarDropdown = ({
  label,
  icon,
  routes,
}: Props) => {

  const [open, setOpen] =
    useState(false);

  const hasPermission =
    useAuthStore(
      (state) =>
        state.hasPermission
    );

  const filteredRoutes =
    useMemo(() => {

      return routes.filter(
        (route) => {

          if (
            !route.permissions ||
            route.permissions.length === 0
          ) {
            return true;
          }

          return route.permissions.every(
            (permission) =>
              hasPermission(permission)
          );
        }
      );
    }, [
      routes,
      hasPermission,
    ]);

  if (
    filteredRoutes.length === 0
  ) {
    return null;
  }

  return (
    <div className="space-y-2">

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
          w-full
          flex
          items-center
          justify-between
          px-4
          py-3
          rounded-xl
          text-slate-300
          hover:bg-slate-800
          hover:text-white
          transition-all
          duration-200
        "
      >

        <div className="flex items-center gap-3">

          {
            icon && (
              <FontAwesomeIcon
                icon={icon}
              />
            )
          }

          <span className="font-medium">
            {label}
          </span>

        </div>

        <FontAwesomeIcon
          icon={faChevronDown}
          className={`
            transition-transform duration-200

            ${
              open
                ? "rotate-180"
                : ""
            }
          `}
        />

      </button>

      {
        open && (
          <div className="ml-4 space-y-2">

            {
              filteredRoutes.map(
                (route) => {

                  if (!route.path || route.showInSidebar == false) {
                    return null;
                  }

                  return (
                    <AppSidebarItem
                      key={route.path}
                      to={route.path}
                      label={route.label}
                    />
                  );
                }
              )
            }

          </div>
        )
      }

    </div>
  );
};

export default AppSidebarDropdown;