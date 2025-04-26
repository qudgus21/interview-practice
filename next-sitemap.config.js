/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://interviewmate.org",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/*", "/_next/*"],
      },
    ],
    additionalSitemaps: ["https://interviewmate.org/sitemap.xml"],
  },
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ["/api/*", "/_next/*"],
  generateIndexSitemap: true,
};
