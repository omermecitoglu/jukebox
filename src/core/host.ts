export function getHost(defaultValue: string | undefined = window.location.origin) {
  return process.env.NODE_ENV === "production" ? defaultValue : "http://localhost:7701";
}
