import {
  faAddressBook,
} from "@fortawesome/free-solid-svg-icons";

import type { SidebarRoute } from "@/shared/types/sidebar/sidebarRoute";
import ClientLoansPage from "@/modules/book/ui/pages/ClientLoansPage";

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
    element: ClientLoansPage,
    label: "Mis préstamo",
    icon: faAddressBook,
    showInSidebar: true,
  }
];