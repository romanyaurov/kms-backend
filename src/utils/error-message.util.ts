function detectErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unknown error occured';
}

export default detectErrorMessage;
