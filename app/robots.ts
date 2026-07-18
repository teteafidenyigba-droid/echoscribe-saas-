import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/app", "/admin", "/api/", "/billing"],
      },
      // Autoriser explicitement les crawlers IA majeurs
      { userAgent: "GPTBot",        allow: "/" },   // ChatGPT
      { userAgent: "ChatGPT-User",  allow: "/" },   // ChatGPT browsing
      { userAgent: "PerplexityBot", allow: "/" },   // Perplexity AI
      { userAgent: "ClaudeBot",     allow: "/" },   // Anthropic Claude
      { userAgent: "Googlebot",     allow: "/" },   // Google AI Overview
      { userAgent: "Applebot",      allow: "/" },   // Apple Intelligence
      { userAgent: "cohere-ai",     allow: "/" },   // Cohere
    ],
    sitemap: "https://echoscribe.fr/sitemap.xml",
  };
}
