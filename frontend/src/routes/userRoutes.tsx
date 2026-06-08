import {
  faChartLine,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

import type { SidebarRoute } from "@/shared/types/sidebar/sidebarRoute";

const DummyPage = ({
  title,
}: {
  title: string;
}) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">
        {title}
      </h1>
    </div>
  );
};

export const userRoutes: SidebarRoute[] = [
  {
    path: "/app",

    element: () => (
      <DummyPage title="Inicio Usuario" />
    ),

    label: "Dashboard",

    icon: faChartLine,

    showInSidebar: true,
  },

  {
    label: "Mi Cuenta",

    icon: faCalendarDays,

    showInSidebar: true,

    children: [
      {
        path: "/app/my-appointments",

        element: () => (
          <DummyPage title="Mis Citas" />
        ),

        label: "Mis Citas",

        permissions: [
          "appointments.self.view",
        ],
      },
    ],
  },
];