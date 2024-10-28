const util = require('util');

const markdownIt = require("markdown-it");
const Image = require('@11ty/eleventy-img');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const svgSprite = require("eleventy-plugin-svg-sprite");

async function imageShortcode (
    src,
    caption,
    alt,
    size=200
) {
  const path = this.page.filePathStem.split('/')[2];

  const imageMetadata = await Image(`weblogdata/weblog/${path}/${src}`, {
    widths: [150, 200, 450, 800],
    formats: ['webp'],
    outputDir: `web/weblog/${path}`,
    urlPath: `/weblog/${path}`,
    filenameFormat: function (id, src, width, format, options) {
      const base = src.split('/').at(-1).split('.')[0];
      return `${base}~${width}.${format}`;
    }
  });

  let thumb = imageMetadata.webp[0]; // 150px
  if (thumb.width > thumb.height) {
    thumb = imageMetadata.webp[1]; // 200px
  }
  const screen = imageMetadata.webp.at(-1); // 800px
  if (size !== 800) {
    return `<a href="${screen.url}" title="${caption}"><img src="${thumb.url}" class="${thumb.width > thumb.height ? 'landscape' : 'portrait'}" width="${thumb.width}" height="${thumb.height}" alt="${alt}"></a>`;
  } else {
    return `<img src="${screen.url}" class="single-image" width="${screen.width}" height="${screen.height}" alt="${alt}" style="--height: ${screen.height}">`;
  }
}

async function ogImageShortcode (
    src,
    alt,
) {
  const path = this.page.filePathStem.split('/')[2];

  const imageMetadata = await Image(`weblogdata/weblog/${path}/${src}`, {
    widths: [800],
    formats: ['webp'],
    outputDir: `web/weblog/${path}`,
    urlPath: `/weblog/${path}`,
    filenameFormat: function (id, src, width, format, options) {
      const base = src.split('/').at(-1).split('.')[0];
      return `${base}~${width}.${format}`;
    }
  });

  const screen = imageMetadata.webp.at(0); // 800px

  return `
    <meta property="og:image" content="https://bitstorm.org${screen.url}">
    <meta property="og:image:width" content="${screen.width}">
    <meta property="og:image:height" content="${screen.height}">
    <meta property="og:image:alt" content="${alt}">`
}

async function rssImageShortcode (
    url,
    src,
) {

  const imgUrl = `${url.match(/.+\//)?.[0]}${src.replace(/\.(webp|png)$/, '~800.webp')}`;

  return `<enclosure
                      url="https://bitstorm.org${imgUrl}"
                      type="image/webp" length="0"/>`;
}

function dateShortcode (
    dateStr,
) {
  if (!dateStr) {
    return '';
  }
  const dateTimeFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' })
  const date = d = new Date(dateStr);
  return dateTimeFormat.format(date);
}

function consoleShortcode (
    arg,
) {
  console.log('>>>', arg);
  console.log('this.page', this.page);
  return `[${arg}]`;
}

function spriteShortcode (
    arg,
) {
  return `<span class="icon" style="--icon: url(/assets/sprite.svg#${arg})"></span>`;
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addGlobalData("permalink", () => {
    return (data) => `${data.page.filePathStem}.${data.page.outputFileExtension}`;
  });

  eleventyConfig.addCollection("weblogByMonth", (collection) => {
    const posts = collection.getFilteredByTag('weblog');
    const years = posts.map(post => /(?<year>[0-9]+)-/.exec(post.filePathStem).groups.year);
    const uniqueYears = [...new Set(years)];

    return uniqueYears.reduce((prev, year) => {
      const filteredPosts = posts.filter(post => /(?<year>[0-9]+)-/.exec(post.filePathStem).groups.year === year);
      filteredPosts.key = year;

      return [
        ...prev,
        filteredPosts
      ]
    }, []);
  });

  eleventyConfig.setLibrary("md", markdownIt({
    html: true,
    linkify: true,
    typographer: true
  }));

  eleventyConfig.addFilter('console', function(value) {
    const str = util.inspect(value);
    return `<div style="white-space: pre-wrap;">${unescape(str)}</div>;`
  });

  eleventyConfig.addShortcode('image', imageShortcode);
  eleventyConfig.addShortcode('og-image', ogImageShortcode);
  eleventyConfig.addShortcode('rssimage', rssImageShortcode);
  eleventyConfig.addShortcode("readable-date", dateShortcode);
  eleventyConfig.addShortcode("test", consoleShortcode);
  eleventyConfig.addShortcode("sprite", spriteShortcode);

  eleventyConfig.addFilter("limit", (array, limit) => array.slice(0, limit));
  eleventyConfig.addFilter("console", (s) => console.log('>>>', s), '');

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy("weblogdata/assets");

  /* ----- */
  return {
    dir: {
      input: "weblogdata",
      output: "web"
    },
    templateFormats: ["html", "md", "liquid", "njk"],
    markdownTemplateEngine: 'njk'
  }
};

