import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import type {
  IconDefinition,
} from "@fortawesome/fontawesome-svg-core";

type Props = {
  to: string;
  label: string;
  icon?: IconDefinition;
};

const AppSidebarItem = ({
  to,
  label,
  icon,
}: Props) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
          flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200

          ${
            isActive
              ? "bg-cyan-500 text-white shadow-lg"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }
        `
      }
    >

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

    </NavLink>
  );
};

export default AppSidebarItem;