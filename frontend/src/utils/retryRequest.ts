export default async function retryRequest(
  fn: () => Promise<any>,
  retries = 2
) {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i === retries) throw err;
    }
  }
  throw lastError;
}
