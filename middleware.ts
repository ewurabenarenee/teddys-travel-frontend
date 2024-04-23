import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
const protectedRoutes: string[] = ["/app", "/user"];

export async function middleware(req: NextRequest): Promise<NextResponse> {
  function needsAuthentication(requestPath: string): boolean {
    return protectedRoutes.some((route) => requestPath.startsWith(route));
  }

  if (needsAuthentication(req.nextUrl.pathname)) {
    const token = await getToken({ req });
    if (!token) {
      const signInUrl = new URL("/auth/signIn", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: protectedRoutes.map((route) => `${route}/:path*`),
};
