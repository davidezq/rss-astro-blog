import rss from "@astrojs/rss";
import { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ params, request, site }) => {
  const blogs = await getCollection("blog");
  return rss({
    stylesheet: '/rss/styles.xsl',
    // `<title>` field in output xml
    title: "Fernando blog",
    // `<description>` field in output xml
    description: "Un pequeño blog para implementar rsss",
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#site
    site: site,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: blogs.map((blog) => ({
      title: blog.data.title,
      description: blog.data.description,
      link: "/posts/"+ blog.slug,
      pubDate: blog.data.date,
    })),
    // (optional) inject custom xml
    customData: `<language>es-sv</language>`,
  });
};
