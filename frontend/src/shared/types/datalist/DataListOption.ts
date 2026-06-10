export type DataListOption<T = unknown> = {
    id: string | number;
    label: string;
    subtitle?: string;
    value?: T;
};