import {
  faBook,
  faRightFromBracket,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthStore } from "@/modules/auth/store/authStore";

import type { SidebarRoute } from "@/shared/types/sidebar/sidebarRoute";

import AppSidebarItem from "./AppSidebarItem";
import AppSidebarDropdown from "./AppSidebarDropdown";

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
  
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);


  const canAccessRoute = (allowedRoles?: string[] | string) => {
    if (!allowedRoles) return true;

    const rolesArray = Array.isArray(allowedRoles)
      ? allowedRoles
      : [allowedRoles];

    return rolesArray.includes(user?.role.name ?? "");
  };

  const buildPath = (path?: string) => {
    if (!path) return "/admin";
    if (path.startsWith("/")) return path;
    return `/admin/${path}`;
  };

  return (
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-72
        bg-slate-900 text-white flex flex-col border-r border-slate-800
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faBook} className="text-white text-xl" />
            </div>

            <div>
              <h1 className="font-bold text-lg leading-none">{title}</h1>
              <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden w-10 h-10 rounded-xl hover:bg-slate-800"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-auto">
          {routes.map((route) => {

            if (route.showInSidebar === false) return null;

            if (!canAccessRoute(route.allowedRoles)) return null;

            // dropdown
            if (route.children?.length) {
              const allowedChildren = route.children.filter(
                (child) =>
                  child.showInSidebar !== false &&
                  canAccessRoute(child.allowedRoles)
              );

              if (!allowedChildren.length) return null;

              return (
                <AppSidebarDropdown
                  key={route.path ?? route.label}
                  label={route.label ?? ""}
                  icon={route.icon}
                  routes={allowedChildren}
                />
              );
            }

            return (
              <AppSidebarItem
                key={route.path ?? route.label}
                to={buildPath(route.path)}
                label={route.label ?? ""}
                icon={route.icon}
              />
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
            hover:bg-red-500/20 text-red-400 transition-all duration-200"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;