export class HttpError extends Error {
  status: number;
  body: string;

  constructor(status: number, body: string) {
    let message = `HTTP_${status}`;

    try {
      const parsed = JSON.parse(body);
      message = parsed.message ?? message;
    } catch {}

    super(message);

    this.status = status;
    this.body = body;
    this.name = "HttpError";
  }
}