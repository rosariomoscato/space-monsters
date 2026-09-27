import type { MetadataRoute } from "next";
import { publicPages, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return publicPages.map((page) => ({ url: `${siteUrl}${page.path}` }));
}
