import {
  faChartLine,
  faUsers,
  faFileLines,
  faAmbulance,
  faCartFlatbed,
} from "@fortawesome/free-solid-svg-icons";

import type { SidebarRoute } from "@/shared/types/sidebar/sidebarRoute";
import { Outlet } from "react-router-dom";
import UsersPage from "@/modules/admin/ui/pages/UsersPage";



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