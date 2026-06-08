
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type SidebarRoute = {
  path?: string;
  index?: boolean;
  element?: React.ComponentType;
  label?: string;
  icon?: IconDefinition;
  showInSidebar?: boolean;
  permissions?: string[];
  allowedRoles?: string[] | string;
  children?: SidebarRoute[];
};
