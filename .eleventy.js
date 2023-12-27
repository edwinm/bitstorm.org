module.exports = function(eleventyConfig) {
  eleventyConfig.addGlobalData("permalink", () => {
    return (data) => `${data.page.filePathStem}.${data.page.outputFileExtension}`;
  });

  eleventyConfig.addPassthroughCopy('./assets');

  return {
    dir: {
      output: "public"
    },
  }
};

