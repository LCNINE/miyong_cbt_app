// 아몬드영(user-service) IdP 로그인 브리지. clip 의 auth.controller(start/callback) 와 같은 흐름.
//   GET /almond-auth/start?returnTo=/path → state/PKCE 쿠키 저장 후 auth-web authorize 로 redirect
//   GET /almond-auth/callback            → code 교환 → userinfo → Supabase 유저 확보
//                                          → magiclink token_hash 를 프론트 /auth/almond 로 넘김
import { createClient } from "npm:@supabase/supabase-js@2";

const env = (k: string) => {
  const v = Deno.env.get(k);
  if (!v) throw new Error(`Missing env: ${k}`);
  return v;
};

const STATE_COOKIE = "almond_oauth_state";
const COOKIE_PATH = "/functions/v1/almond-auth";

const b64url = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const random = (n: number) => b64url(crypto.getRandomValues(new Uint8Array(n)));

// 외부 URL / protocol-relative(`//evil.com`) 차단
const safeReturnTo = (raw: string | null | undefined) =>
  raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";

const redirect = (url: string, cookie?: string) =>
  new Response(null, {
    status: 302,
    headers: { Location: url, ...(cookie && { "Set-Cookie": cookie }) },
  });

const toFrontend = (params: Record<string, string>, clearCookie = true) =>
  redirect(
    `${env("FRONTEND_URL")}/auth/almond?${new URLSearchParams(params)}`,
    clearCookie ? `${STATE_COOKIE}=; Path=${COOKIE_PATH}; Max-Age=0` : undefined,
  );

async function start(url: URL) {
  const state = random(24);
  const codeVerifier = random(48);
  const codeChallenge = b64url(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier)),
  );
  const payload = encodeURIComponent(
    JSON.stringify({ state, codeVerifier, returnTo: safeReturnTo(url.searchParams.get("returnTo")) }),
  );

  const authorize = new URL(env("ALMOND_AUTHORIZE_URL"));
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("client_id", env("ALMOND_CLIENT_ID"));
  authorize.searchParams.set("redirect_uri", env("ALMOND_REDIRECT_URI"));
  authorize.searchParams.set("state", state);
  authorize.searchParams.set("code_challenge", codeChallenge);
  authorize.searchParams.set("code_challenge_method", "S256");

  return redirect(
    authorize.toString(),
    `${STATE_COOKIE}=${payload}; Path=${COOKIE_PATH}; Max-Age=3600; HttpOnly; Secure; SameSite=Lax`,
  );
}

async function callback(req: Request, url: URL) {
  const raw = req.headers.get("cookie")?.match(new RegExp(`${STATE_COOKIE}=([^;]+)`))?.[1];
  let stored: { state: string; codeVerifier: string; returnTo: string } | null = null;
  try {
    stored = raw ? JSON.parse(decodeURIComponent(raw)) : null;
  } catch { /* 깨진 쿠키 = 세션 만료 취급 */ }

  const code = url.searchParams.get("code");
  if (url.searchParams.get("error")) return toFrontend({ error: "oauth_denied" });
  if (!stored || stored.state !== url.searchParams.get("state") || !code) {
    return toFrontend({ error: "session_expired" });
  }

  try {
    // user-service 토큰 요청은 camelCase JSON, 응답은 snake_case (clip user-service.client 와 동일)
    const tokenRes = await fetch(env("ALMOND_TOKEN_URL"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grantType: "authorization_code",
        clientId: env("ALMOND_CLIENT_ID"),
        clientSecret: env("ALMOND_CLIENT_SECRET"),
        code,
        codeVerifier: stored.codeVerifier,
        redirectUri: env("ALMOND_REDIRECT_URI"),
      }),
    });
    if (!tokenRes.ok) throw new Error(`token ${tokenRes.status}: ${await tokenRes.text()}`);
    const { access_token } = await tokenRes.json();

    const infoRes = await fetch(env("ALMOND_USERINFO_URL"), {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!infoRes.ok) throw new Error(`userinfo ${infoRes.status}`);
    const info: { sub: string; email: string; nickname?: string; username?: string } =
      await infoRes.json();

    const admin = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));

    // ponytail: 이메일 기준으로 기존 Supabase 계정과 합쳐짐. user-service 가 이메일 인증을 보장한다는 전제.
    // 아니라면 almond_sub 로 매핑 테이블을 두고 조회해야 함.
    const { error: createErr } = await admin.auth.admin.createUser({
      email: info.email,
      email_confirm: true,
      user_metadata: { almond_sub: info.sub, nickname: info.nickname ?? info.username },
    });
    if (createErr && createErr.code !== "email_exists") throw createErr;

    const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email: info.email });
    if (error) throw error;

    return toFrontend({ token_hash: data.properties.hashed_token, returnTo: stored.returnTo });
  } catch (err) {
    console.error("almond callback failed:", err);
    const msg = String(err).toLowerCase();
    return toFrontend({ error: msg.includes("expired") ? "code_expired" : "signin_failed" });
  }
}

Deno.serve((req) => {
  const url = new URL(req.url);
  if (url.pathname.endsWith("/start")) return start(url);
  if (url.pathname.endsWith("/callback")) return callback(req, url);
  return new Response("Not found", { status: 404 });
});
