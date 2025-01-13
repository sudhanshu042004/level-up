import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

export default async function middleware(req: NextRequest) {

  const currentPath = req.nextUrl.pathname;

  // Check if the route is protected (all routes in this case)
  const isProtectedRoute = currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/'; // Example exceptions

  if (isProtectedRoute) {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('session')?.value
    const session = await decrypt(cookie as string);
    console.log("session is accessed");

    if (!session?.userId) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
  }

  return NextResponse.next();

}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}
