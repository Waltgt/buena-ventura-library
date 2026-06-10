import {
    faArrowDownShortWide,
    faArrowUpWideShort,
} from "@fortawesome/free-solid-svg-icons";

export const TABLE_ICONS = {
    SORT_ASC: faArrowUpWideShort,
    SORT_DESC: faArrowDownShortWide,
    SORT_DEFAULT: faArrowDownShortWide,
} as const;

export type TableIcon =
    (typeof TABLE_ICONS)[keyof typeof TABLE_ICONS];