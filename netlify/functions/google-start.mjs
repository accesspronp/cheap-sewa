import { getStore } from "@netlify/blobs";
import { randomBytes } from "node:crypto";
const REDIRECT = "https://cheapsewa.store/api/google-callback";
export default async () => {
  const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
  if (!clientId) return new Response("Google sign-in is not set up yet. Please use your email and password.", { status: 503 });
  const state = randomBytes(24).toString("hex");
  await getStore("sessions").setJSON("gstate-" + state, { exp: Date.now() + 600000 });
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({ client_id: clientId, redirect_uri: REDIRECT, response_type: "code", scope: "openid email profile", state, prompt: "select_account" }).toString();
  return Response.redirect(url.toString(), 302);
};
export const config = { path: "/api/google-start" };
