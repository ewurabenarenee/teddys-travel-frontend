import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  if (req.nextUrl.pathname.startsWith("/app")) {
    if (!token) {
      const signInUrl = new URL("/auth/signIn", req.url);
      signInUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config: NextMiddlewareConfig = {
  matcher: ["/app/:path*"],
};
