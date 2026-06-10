export class RequestAbortedError extends Error {
  constructor(message = "REQUEST_ABORTED") {
    super(message);
    this.name = "RequestAbortedError";
  }
}