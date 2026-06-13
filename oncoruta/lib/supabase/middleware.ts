import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/lib/supabase/types";

// Rutas que no requieren autenticación
const PUBLIC_PATHS = ["/login", "/registro"];

// Rutas por rol: el prefijo de pathname determina el rol requerido
const ROLE_ROUTES: { prefix: string; role: UserRole }[] = [
  { prefix: "/admin", role: "admin" },
  { prefix: "/familiar", role: "familiar" },
  // Las rutas de paciente son el resto de rutas protegidas
];

// Rutas exclusivas de paciente (no tienen prefijo propio)
const PACIENTE_PATHS = ["/dashboard", "/proceso", "/documentos", "/citas", "/informacion"];

// Redirige al dashboard correspondiente según el rol
function dashboardForRole(role: UserRole): string {
  if (role === "admin") return "/admin/dashboard";
  if (role === "familiar") return "/familiar/dashboard";
  return "/dashboard";
}

export async function updateSession(request: NextRequest) {
  // Inicializa supabaseResponse para que las cookies se propaguen correctamente
  let supabaseResponse = NextResponse.next({ request });

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

  // getUser() valida el token con Supabase — no usar getSession() en middleware
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 1. Rutas públicas: accesibles sin sesión
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) {
    // Si ya tiene sesión, redirigir al dashboard de su rol para no volver a /login
    if (user) {
      const role = (user.user_metadata?.role ?? "paciente") as UserRole;
      const url = request.nextUrl.clone();
      url.pathname = dashboardForRole(role);
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  // 2. Sin sesión: redirigir a /login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    // Guardar la ruta original para redirigir después del login
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // 3. Con sesión: verificar rol
  const role = (user.user_metadata?.role ?? "paciente") as UserRole;

  // Detectar qué rol requiere la ruta actual
  const matchedRoleRoute = ROLE_ROUTES.find((r) => pathname.startsWith(r.prefix));
  const isPacienteRoute = PACIENTE_PATHS.some((p) => pathname.startsWith(p));

  if (matchedRoleRoute) {
    // Ruta con prefijo explícito (/admin/*, /familiar/*)
    if (role !== matchedRoleRoute.role) {
      const url = request.nextUrl.clone();
      url.pathname = dashboardForRole(role);
      url.searchParams.delete("redirect");
      return NextResponse.redirect(url);
    }
  } else if (isPacienteRoute) {
    // Rutas de paciente (/dashboard, /proceso, etc.)
    if (role !== "paciente") {
      const url = request.nextUrl.clone();
      url.pathname = dashboardForRole(role);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
