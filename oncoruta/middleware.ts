import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type UserRole = "paciente" | "admin";

const PUBLIC_PATHS = ["/login", "/registro"];
const PACIENTE_PATHS = ["/dashboard", "/proceso", "/documentos", "/citas", "/informacion", "/mis-datos"];

function dashboardForRole(role: UserRole): string {
  return role === "admin" ? "/admin/dashboard" : "/dashboard";
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (isPublic) {
    if (user) {
      const { data } = await supabase.from("usuarios").select("rol").eq("id", user.id).single();
      const role = (data?.rol ?? "paciente") as UserRole;
      const url = request.nextUrl.clone();
      url.pathname = dashboardForRole(role);
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  const { data } = await supabase.from("usuarios").select("rol").eq("id", user.id).single();
  const role = (data?.rol ?? "paciente") as UserRole;

  const isAdminRoute = pathname.startsWith("/admin");
  const isPacienteRoute = PACIENTE_PATHS.some((p) => pathname.startsWith(p));

  if (isAdminRoute && role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = dashboardForRole(role);
    return NextResponse.redirect(url);
  }

  if (isPacienteRoute && role !== "paciente") {
    const url = request.nextUrl.clone();
    url.pathname = dashboardForRole(role);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf)$).*)",
  ],
};
