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
    path: "users",
    element: UsersPage,
    label: "Gestion de libros",
    icon: faBook,
    showInSidebar: true,
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
        path: "books/detail",
        element: BookDetailsPage,
        showInSidebar: false
      },  
      {
        path: "books/assign",
        element: BookAssignmentPage,
        showInSidebar: false
      },  
      {
        path: "books/assign/edit/:id",
        element: BookAssignmentPage
      },  
    ]
  }
  // {
  //   label: "Gestión pacientes",
  //   icon: faUsers,
  //   showInSidebar: true,
  //   children: [
  //     {
  //       path: "patients",
  //       element: PatientsPage,
  //       label: "Pacientes",
  //       permissions: [PERMISSIONS.PATIENT.MODULE_ACCESS],
  //     },
  //     {
  //       path: "patients/create",
  //       element: CreatePatientPage,
  //       label: "Crear paciente",
  //       showInSidebar: false,
  //       permissions: [PERMISSIONS.PATIENT.CREATE],
  //     },
  //     {
  //       path: "patients/:id/edit",
  //       element: PatientFormPage,
  //       label: "Editar paciente",
  //       showInSidebar: false,
  //       permissions: [PERMISSIONS.PATIENT.EDIT],
  //     },

  //     {
  //       path: "patients/:id",
  //       element: PatientDetailsPage,
  //       label: "Detalle paciente",
  //       showInSidebar: false,
  //       permissions: [PERMISSIONS.PATIENT.VIEW_DETAIL],
  //     },
  //     // Citas
  //     {
  //       path: "appointments",
  //       element: AppointmentCalendarPage,
  //       label: "Citas médicas",
  //       permissions: [PERMISSIONS.APPOINTMENT.MODULE_ACCESS],
  //     },
  //     {
  //       path: "appointments/new",
  //       element: AppointmentFormPage,
  //       showInSidebar: false,
  //       permissions: [PERMISSIONS.APPOINTMENT.CREATE],
  //     },

  //     {
  //       path: "appointments/:id",
  //       element: AppointmentDetailsPage,
  //       showInSidebar: false,
  //       permissions: [PERMISSIONS.APPOINTMENT.VIEW_DETAIL],
  //     },

  //     {
  //       path: "appointments/:id/edit",
  //       element: AppointmentFormPage,
  //       showInSidebar: false,
  //       permissions: [PERMISSIONS.APPOINTMENT.EDIT],
  //     },
  //     {
  //       path: "appointments/:id/attend",
  //       element: AttendAppointmentPage,
  //       showInSidebar: false,
  //       permissions: [PERMISSIONS.APPOINTMENT.EDIT],
  //     },
  //   ],
  // },

];