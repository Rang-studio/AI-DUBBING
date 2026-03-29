export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dub/:path*", "/api/dub", "/api/whitelist"]
};
