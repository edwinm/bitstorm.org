const util = require('util');
// const path = require('path');

const Image = require('@11ty/eleventy-img');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const typographyPlugin = require("@jamshop/eleventy-plugin-typography");
const svgSprite = require("eleventy-plugin-svg-sprite");

async function imageShortcode (
    src,
    caption,
    alt,
    size=200
) {
  // console.log('----')
  // console.log('src', src)
  // console.log('this.page.url', this.page.url)
  // console.log('this.page.filePathStem', this.page.filePathStem)
  const path = this.page.filePathStem.split('/')[2];
  // console.log('path', path)

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
  if (size != 800) {
    return `<a href="${screen.url}" title="${caption}"><img src="${thumb.url}" class="${thumb.width > thumb.height ? 'landscape' : 'portrait'}" width="${thumb.width}" height="${thumb.height}" alt="${alt}"></a>`;
  } else {
    return `<img src="${screen.url}" class="single-image" width="${screen.width}" height="${screen.height}" alt="${alt}" style="--height: ${screen.height}">`;
  }
}

function dateShortcode (
    dateStr,
) {
  if (!dateStr) {
    return '';
  }
  const dateTimeFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'short' })
  const date = d = new Date(dateStr);
  return dateTimeFormat.format(date);
}

function consoleShortcode (
    arg,
) {
  console.log('arg', arg);
  console.log('this.page', this.page);
  return `[${arg}]`;
}

function spriteShortcode (
    arg,
) {
  return `
  <svg
      viewBox="0 0 100 100"
  >
      <filter id="invert">
          <feColorMatrix in="SourceGraphic" type="matrix" values="
               -1  0  0  0  1
                0 -1  0  0  1
                0  0 -1  0  1
                0  0  0  1  0"/>
      </filter>
      <defs>
          <mask id="mask-id-${arg}">
              <use xlink:href="/assets/svg-sprite.svg#svg-${arg}" filter="url(#invert)"></use>
          </mask>
      </defs>
      <rect
          width="100"
          height="100"
          style="fill: currentColor"
          mask="url(#mask-id-${arg})"
      />
  </svg>`;
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addGlobalData("permalink", () => {
    return (data) => `${data.page.filePathStem}.${data.page.outputFileExtension}`;
  });

  eleventyConfig.addCollection("weblogByMonth", (collection) => {
    // /(?<year>[0-9]+)-/.exec('/weblog/2010-4/Introduction').groups.year
    const posts = collection.getFilteredByTag('weblog');
    const years = posts.map(post => /(?<year>[0-9]+)-/.exec(post.filePathStem).groups.year);
    const uniqueYears = [...new Set(years)];

    const postsByYear = uniqueYears.reduce((prev, year) => {
      // const filteredPosts = posts.filter(post => post.filePathStem.split('/')?.[1] === year);
      const filteredPosts = posts.filter(post => /(?<year>[0-9]+)-/.exec(post.filePathStem).groups.year === year);
      filteredPosts.key = year;

      return [
        ...prev,
        filteredPosts
      ]
    }, []);

    return postsByYear;
  });

  // weblogdata/assets/icons

  eleventyConfig.addFilter('console', function(value) {
    const str = util.inspect(value);
    return `<div style="white-space: pre-wrap;">${unescape(str)}</div>;`
  });

  eleventyConfig.addShortcode('image', imageShortcode);
  eleventyConfig.addShortcode("readable-date", dateShortcode);
  eleventyConfig.addShortcode("test", consoleShortcode);
  eleventyConfig.addShortcode("sprite", spriteShortcode);

  eleventyConfig.addFilter("limit", (array, limit) => array.slice(0, limit));
  eleventyConfig.addFilter("console", (s) => console.log('>>>', s), '');

  // eleventyConfig.addPlugin(typographyPlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(svgSprite, {
    path: "./weblogdata/assets/icons",
    outputFilepath: "./web/assets/svg-sprite.svg"
  });

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

