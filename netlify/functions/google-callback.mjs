import { getStore } from "@netlify/blobs";
import { randomBytes } from "node:crypto";
import { ekey, clean } from "../lib/lib.mjs";
const REDIRECT = "https://cheapsewa.store/api/google-callback";
const back = (q) => Response.redirect("https://cheapsewa.store/account.html" + q, 302);
export default async (req) => {
  const u = new URL(req.url);
  const code = u.searchParams.get("code") || "", state = u.searchParams.get("state") || "";
  const sessions = getStore("sessions"), users = getStore("users");
  if (u.searchParams.get("error") || !code || !/^[a-f0-9]{48}$/.test(state)) return back("?google=cancel");
  const st = await sessions.get("gstate-" + state, { type: "json" });
  await sessions.delete("gstate-" + state);
  if (!st || st.exp < Date.now()) return back("?google=expired");
  const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim(), secret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();
  if (!clientId || !secret) return back("?google=failed");
  const tr = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: clientId, client_secret: secret, redirect_uri: REDIRECT, grant_type: "authorization_code" })
  });
  const t = await tr.json().catch(() => ({}));
  if (!tr.ok || !t.access_token) return back("?google=failed");
  const ui = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: "Bearer " + t.access_token } });
  const info = await ui.json().catch(() => ({}));
  if (!ui.ok || !info.email || info.email_verified === false) return back("?google=failed");
  const email = String(info.email).toLowerCase();
  let usr = await users.get(ekey(email), { type: "json" });
  if (!usr) {
    usr = { id: randomBytes(6).toString("hex"), name: clean(info.name, 80) || email.split("@")[0], email, phone: "", createdAt: new Date().toISOString(), emailVerified: true, google: true };
    await users.setJSON(ekey(email), usr);
  }
  const token = randomBytes(32).toString("hex");
  await sessions.setJSON(token, { email, exp: Date.now() + 30 * 864e5 });
  return back("#gtoken=" + token + "&gname=" + encodeURIComponent(usr.name) + "&gemail=" + encodeURIComponent(email));
};
export const config = { path: "/api/google-callback" };
