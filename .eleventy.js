const util = require('util');

const Image = require('@11ty/eleventy-img');
const pluginRss = require("@11ty/eleventy-plugin-rss");
// const path = require('path');

async function imageShortcode (
    src,
    caption,
    alt,
) {
  console.log('----')
  console.log('src', src)
  console.log('this.page.url', this.page.url)
  console.log('this.page.filePathStem', this.page.filePathStem)
  const path = this.page.filePathStem == '/pages/month' ? this.page.url.split('/')[2] : this.page.filePathStem.split('/')[1];

  const imageMetadata = await Image(`weblogdata/${path}/${src}`, {
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
  return `<a href="${screen.url}" title="${caption}"><img src="${thumb.url}" class="${thumb.width > thumb.height ? 'landscape' : 'portrait'}" width="${thumb.width}" height="${thumb.height}" alt="${alt}"></a>`;
}

function monthShortcode (
    date,
) {
  const months = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
  const [year, month] = date.split('-');
  return `${months[month - 1]} ${year}`;
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

function testShortcode (
    arg,
) {
  // console.log('arg', arg);
  // console.log('this.page', this.page);
  return `[${arg}]`;
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addGlobalData("permalink", () => {
    return (data) => `${data.page.filePathStem}.${data.page.outputFileExtension}`;
  });

  eleventyConfig.addCollection("weblogByMonth", (collection) => {
    const posts = collection.getFilteredByTag('weblog');
    const years = posts.map(post => post.filePathStem.split('/')?.[1]);
    const uniqueYears = [...new Set(years)];

    const postsByYear = uniqueYears.reduce((prev, year) => {
      const filteredPosts = posts.filter(post => post.filePathStem.split('/')?.[1] === year);
      filteredPosts.key = year;

      return [
        ...prev,
        filteredPosts
      ]
    }, []);

    return postsByYear;
  });

  eleventyConfig.addFilter('console', function(value) {
    const str = util.inspect(value);
    return `<div style="white-space: pre-wrap;">${unescape(str)}</div>;`
  });

  eleventyConfig.addShortcode('image', imageShortcode);
  eleventyConfig.addShortcode('month', monthShortcode);
  eleventyConfig.addShortcode("readable-date", dateShortcode);
  eleventyConfig.addFilter("limit", (array, limit) => array.slice(0, limit));

  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addPassthroughCopy("weblogdata/assets");

  /* ----- */
  return {
    dir: {
      input: "weblogdata",
      output: "web"
    },
    // markdownTemplateEngine: 'njk'
  }
};

