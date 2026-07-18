import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/app", "/admin", "/api/", "/billing"],
      },
    ],
    sitemap: "https://echoscribe.fr/sitemap.xml",
  };
}
