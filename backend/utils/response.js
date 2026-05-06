export default function createResponse(message, status = "success") {
  return { status, message };
}
