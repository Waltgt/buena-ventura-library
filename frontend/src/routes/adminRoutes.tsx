import {
  faChartLine,
  faUsers,
  faFileLines,
  faAmbulance,
  faCartFlatbed,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

import type { SidebarRoute } from "@/shared/types/sidebar/sidebarRoute";
import { Outlet } from "react-router-dom";
import UsersPage from "@/modules/admin/ui/pages/UsersPage";
import BooksListPage from "@/modules/book/ui/pages/BooksListPage";
import BookFormPage from "@/modules/book/ui/pages/BookFormPage";
import BookDetailsPage from "@/modules/book/ui/pages/BookDetailsPage";
import BookAssignmentPage from "@/modules/book/ui/pages/BookAssignmentPage";
import LoanManagementPage from "@/modules/book/ui/pages/LoanManagementPage";




const DummyPage = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold">{title}</h1>
  </div>
);

const DashboardPage = () => {
  return (
    <>
    <DummyPage title="Dashboard" />
    <h1>test</h1>
    <Outlet /> 
    </>
  )
}

export const adminRoutes: SidebarRoute[] = [
  {
    path: "/admin",
    element: DashboardPage,
    // index: true,
    label: "Dashboard",
    icon: faChartLine,
    showInSidebar: true,
  },
  {
    path: "users",
    element: UsersPage,
    label: "Gestion de usuarios",
    icon: faUsers,
    showInSidebar: true,
  },
  {
    path: "books",
    element: UsersPage,
    label: "Gestion de libros",
    icon: faBook,
    showInSidebar: true,
    allowedRoles: ["Gestor", "Administrador"],
    children: [
      {
        path: "books",
        label: "Libros del sistema",
        element: BooksListPage

      },
      {
        path: "books/create",
        element: BookFormPage,
        showInSidebar: false
      },  
      {
        path: "books/edit/:id",
        element: BookFormPage,
        showInSidebar: false
      },  
      {
        path: "books/detail/:id",
        element: BookDetailsPage,
        showInSidebar: false
      },  
      {
        path: "loans/assign/new",
        element: BookAssignmentPage,
        showInSidebar: false
      },  
      {
        path: "loans/assign/edit/:id",
        element: BookAssignmentPage,
        showInSidebar: false
      },  
      {
        path: "books/loans",
        element: LoanManagementPage,
        showInSidebar: true,
        label: "Administrar préstamos"
      },  
    ]
  }


];