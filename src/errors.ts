export class CompactNumberError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CompactNumberError';
  }
}
