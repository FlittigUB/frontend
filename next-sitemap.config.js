// next-sitemap.js

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { get } = require('axios');

module.exports = {
  siteUrl: 'https://flittigub.no',
  generateRobotsTxt: true, // Generates robots.txt file
  sitemapSize: 5000,
  exclude: ['/api/*', '/admin/*'], // Excludes API and admin routes
  transform: async (config, path) => {
    return {
      loc: path, // Absolute URL
      changefreq: 'daily',
      priority: 0.7,
    };
  },
  additionalPaths: async () => {
    const paths = [];

    // Fetch employee slugs from Directus
    try {
      const employeeResponse = await get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const employees = employeeResponse.data;

      // Ensure 'employees' is an array
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
        console.error('Employees response data is not an array:', employees);
      }
    } catch (error) {
      console.error('Error fetching employee slugs for sitemap:', error);
    }

    // Fetch info slugs from Directus
    try {
      const infosResponse = await get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/info`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const infos = infosResponse.data;

      // Ensure 'infos' is an array
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
        console.error('Infos response data is not an array:', infos);
      }
    } catch (error) {
      console.error('Error fetching info slugs for sitemap:', error);
    }

    // Fetch job slugs from Directus
    try {
      const jobsResponse = await get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/job/all`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const jobs = jobsResponse.data;

      // Ensure 'jobs' is an array
      if (Array.isArray(jobs)) {
        const jobSlugs = jobs.map((job) => job.slug);

        jobSlugs.forEach((slug) => {
          paths.push({
            loc: `/portal/stillinger/${slug}`,
            changefreq: 'daily',
            priority: 0.7,
          });
        });
      } else {
        console.error('Jobs response data is not an array:', jobs);
      }
    } catch (error) {
      console.error('Error fetching job slugs for sitemap:', error);
    }

    return paths;
  },
};
