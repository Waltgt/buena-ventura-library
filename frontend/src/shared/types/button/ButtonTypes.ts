export const BUTTON_COLORS = {
    GREEN: "green",
    BLUE: "blue",
    RED: "red",
    GRAY: "gray",
} as const;

export type ButtonColor =
    (typeof BUTTON_COLORS)[keyof typeof BUTTON_COLORS];