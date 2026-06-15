import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/registro"];
const ADMIN_PREFIX = "/admin";
const PACIENTE_PATHS = ["/dashboard", "/proceso", "/documentos", "/citas", "/informacion", "/mis-datos"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets — always pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.(.*)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

    // Public routes
    if (isPublic) {
      if (user) {
        // Already logged in — redirect to appropriate dashboard
        const { data } = await supabase
          .from("usuarios")
          .select("rol")
          .eq("id", user.id)
          .single();
        const role = (data?.rol as string) ?? "paciente";
        const url = request.nextUrl.clone();
        url.pathname = role === "admin" ? "/admin/dashboard" : "/dashboard";
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }

    // Protected routes — require auth
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Role-based access
    const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
    const isPacienteRoute = PACIENTE_PATHS.some((p) => pathname.startsWith(p));

    if (isAdminRoute || isPacienteRoute) {
      const { data } = await supabase
        .from("usuarios")
        .select("rol")
        .eq("id", user.id)
        .single();
      const role = (data?.rol as string) ?? "paciente";

      if (isAdminRoute && role !== "admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
      }
      if (isPacienteRoute && role !== "paciente") {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/dashboard";
        return NextResponse.redirect(url);
      }
    }

    return supabaseResponse;
  } catch {
    // On any unexpected error, pass through to let the page handle auth
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf)$).*)",
  ],
};
