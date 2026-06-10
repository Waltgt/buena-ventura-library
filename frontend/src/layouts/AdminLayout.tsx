import {
  useState,
} from "react";

import {
  Outlet,
} from "react-router-dom";

import AppHeader from "@/shared/components/layout/AppHeader";
import AppSidebar from "@/shared/components/layout/AppSidebar";

import { adminRoutes } from "@/routes/adminRoutes";

const AdminLayout = () => {

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  return (
    <div className="h-screen flex bg-slate-100 overflow-hidden">

      <AppSidebar
        title="Librería Buen Ventura"
        subtitle="Sistema de librería"
        routes={adminRoutes}
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="flex-1 flex flex-col overflow-hidden">

        <AppHeader
          title="Panel Administrativo"
          subtitle="Gestión de préstamos de libros"
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main
          className="
            flex-1
            overflow-auto
            p-4
            md:p-6
          "
        >
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;