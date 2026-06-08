
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type SidebarRoute = {
  path?: string;
  element?: React.ComponentType;
  label?: string;
  icon?: IconDefinition;
  showInSidebar?: boolean;
  permissions?: string[];
  children?: SidebarRoute[];
};