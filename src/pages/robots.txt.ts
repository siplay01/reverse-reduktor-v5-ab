import { SETTINGS } from "../lib/site";
export const GET = () => new Response(SETTINGS.indexable ? "User-agent: *\nAllow: /\n" : "User-agent: *\nDisallow: /\n");
