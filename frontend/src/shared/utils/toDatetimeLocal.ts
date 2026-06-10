export function toDatetimeLocal(value: string | Date) {
    const date = new Date(value);

    const pad = (n: number) => n.toString().padStart(2, "0");

    return (
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate()) +
        "T" +
        pad(date.getHours()) +
        ":" +
        pad(date.getMinutes())
    );
}