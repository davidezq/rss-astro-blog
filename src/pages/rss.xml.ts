import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";

const parser = new MarkdownIt();

export const GET: APIRoute = async ({ params, request, site }) => {
  const blogs = await getCollection("blog");
  return rss({
    xmlns: {
      media: "http://search.yahoo.com/mrss/",
    },
    stylesheet: "/rss/styles.xsl",
    // `<title>` field in output xml
    title: "Fernando blog",
    // `<description>` field in output xml
    description: "Un pequeño blog para implementar rsss",
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#site
    site: site ?? "https://www.google.com",
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: blogs.map((blog) => ({
      title: blog.data.title,
      description: blog.data.description,
      link: "/posts/" + blog.slug,
      pubDate: blog.data.date,
      content: sanitizeHtml(parser.render(blog.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
      customData: `<media:content
      type="image/${blog.data.image.format === "jpg" ? "jpeg" : "png"}"
      width="${blog.data.image.width}"
      height="${blog.data.image.height}"
      medium="image"
      url="${site + blog.data.image.src}" />
  `,
    })),
    // (optional) inject custom xml
    customData: `<language>es-sv</language>`,
  });
};
