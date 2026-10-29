import { REQUISITES } from "../lib/site";
export const GET = () => new Response(["Карточка предприятия", "", ...REQUISITES.map(([k, v]) => `${k}: ${v}`), ""].join("\r\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
