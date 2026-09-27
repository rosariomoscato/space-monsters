import { publicPages, site, siteUrl } from "@/lib/site";

export function GET() {
  const body = [`# ${site.name}`, "", `> ${site.description}`, "", "## Pages", "", ...publicPages.map((page) => `- [${page.title}](${siteUrl}${page.path}): ${page.summary}`), ""].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
