import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, supabaseConfig } from "@/lib/config";
export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("x-content-slug");
  const match = /^\/content\/([^/]+)\/?$/.exec(request.nextUrl.pathname);
  if (match) requestHeaders.set("x-content-slug", match[1]);
  let response = NextResponse.next({ request: { headers: requestHeaders } });
  if (match && isSupabaseConfigured()) {
    const { url, key } = supabaseConfig();
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
    });
    const { data, error } = await client
      .from("contents")
      .select("id")
      .eq("slug", match[1])
      .eq("published", true)
      .maybeSingle();
    if (!error && !data) {
      // Resolve missing content before rendering so Next returns the 404 HTML shell.
      requestHeaders.delete("x-content-slug");
      return NextResponse.rewrite(new URL("/404", request.url), {
        status: 404,
        request: { headers: requestHeaders },
      });
    }
  }
  if (!isSupabaseConfigured()) {
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      request.nextUrl.pathname !== "/admin/login"
    )
      return NextResponse.redirect(new URL("/admin/login", request.url));
    return response;
  }
  if (!/^\/(admin|api\/admin)(\/|$)/.test(request.nextUrl.pathname))
    return response;
  const { url, key } = supabaseConfig();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        requestHeaders.set("cookie", request.cookies.toString());
        response = NextResponse.next({ request: { headers: requestHeaders } });
        values.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (
    !user &&
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login"
  ) {
    const redirect = NextResponse.redirect(
      new URL("/admin/login", request.url),
    );
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|assets/|favicon.ico).*)"],
};
