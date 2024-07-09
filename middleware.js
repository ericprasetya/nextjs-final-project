import { NextResponse } from "next/server";

export function middleware(req) {
  const pathName = req.nextUrl.pathname;
  const isCookiesExists = !!req.cookies.get("user_token");

  const isLoginPage = pathName.startsWith("/login");
  const isRegisterPage = pathName.startsWith("/register");

  if (!isCookiesExists && (isLoginPage || isRegisterPage)) {
    // Allow access to login and register pages if the user is not logged in
    return NextResponse.next();
  }

  if (!isCookiesExists && !(isLoginPage || isRegisterPage)) {
    // Redirect to login if the user is not logged in and trying to access other pages
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isCookiesExists && (isLoginPage || isRegisterPage)) {
    // Redirect to the homepage if the user is logged in and trying to access login or register pages
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Allow access to other pages if the user is logged in
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
