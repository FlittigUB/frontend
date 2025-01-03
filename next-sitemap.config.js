// next-sitemap.js

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { get } = require('axios');
module.exports = {
  siteUrl: 'https://flittigub.no',
  generateRobotsTxt: true, // Genererer robots.txt-fil
  sitemapSize: 5000,
  exclude: ['/api/*', '/admin/*'], // Ekskluderer API- og admin-ruter
  transform: async (config, path) => {
    return {
      loc: path, // Absolutt URL
      changefreq: 'daily',
      priority: 0.7,
    };
  },
  additionalPaths: async () => {
    const paths = [];
    // Hent ansatt-slugger fra Directus
    try {
      const employeeResponse = await get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const employees = employeeResponse.data;

      // Sjekk at 'data' finnes og er et array
      if (Array.isArray(employees)) {
        const employeeSlugs = employees.map((info) => info.id);

        employeeSlugs.forEach((id) => {
          paths.push({
            loc: `/info/om-oss/${id}`,
            changefreq: 'daily',
            priority: 0.7,
          });
        });
      } else {
        console.error('employees response data is not an array:', employees);
      }
    } catch (error) {
      console.error('Feil ved henting av infog-slugger for sitemap:', error);
    }
    // Hent infog-slugger fra Directus
    try {
      const infosResponse = await get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/info`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const infos = infosResponse.data;

      // Sjekk at 'data' finnes og er et array
      if (Array.isArray(infos)) {
        const infoSlugs = infos.map((info) => info.id);

        infoSlugs.forEach((id) => {
          paths.push({
            loc: `/info/${id}`,
            changefreq: 'daily',
            priority: 0.7,
          });
        });
      } else {
        console.error('infos response data is not an array:', infos);
      }
    } catch (error) {
      console.error('Feil ved henting av infog-slugger for sitemap:', error);
    }
    return paths;
  },
};
