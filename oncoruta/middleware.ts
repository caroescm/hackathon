import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto:
     * - _next/static (archivos estáticos de Next.js)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     * - Archivos de imagen/fuente (svg, png, jpg, etc.)
     * - /api/whatsapp/webhook (endpoint público para verificación de Meta)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/whatsapp|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf)$).*)",
  ],
};
