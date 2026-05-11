const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasPublicSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function hasAdminSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

function buildUrl(path, query = "") {
  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing.");
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const base = `${supabaseUrl.replace(/\/$/, "")}/rest/v1${cleanPath}`;
  return query ? `${base}?${query}` : base;
}

function buildHeaders(key, extraHeaders = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extraHeaders
  };
}

export async function publicSupabaseRequest(path, { query = "", revalidate = 3600, tags = [] } = {}) {
  if (!hasPublicSupabaseConfig()) {
    throw new Error("Public Supabase environment variables are missing.");
  }

  const response = await fetch(buildUrl(path, query), {
    headers: buildHeaders(supabaseAnonKey),
    next: { revalidate, tags }
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase public request failed: ${response.status} ${message}`);
  }

  return response.json();
}

export async function adminSupabaseRequest(
  path,
  { method = "GET", query = "", body, prefer, extraHeaders = {} } = {}
) {
  if (!hasAdminSupabaseConfig()) {
    throw new Error("Admin Supabase environment variables are missing.");
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: buildHeaders(supabaseServiceRoleKey, {
      ...(prefer ? { Prefer: prefer } : {}),
      ...extraHeaders
    }),
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store"
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase admin request failed: ${response.status} ${message}`);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
