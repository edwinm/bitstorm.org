import { constants, brotliCompressSync } from "node:zlib";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_EXTENSIONS = [
  "html",
  "css",
  "js",
  "mjs",
  "json",
  "svg",
  "xml",
  "txt",
  "webmanifest",
  "opml",
  "rss",
  "atom",
];

async function findFiles(dir, extensions) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return findFiles(fullPath, extensions);
      }
      const ext = path.extname(entry.name).slice(1).toLowerCase();
      return extensions.includes(ext) ? [fullPath] : [];
    })
  );
  return files.flat();
}

function compress(content) {
  return brotliCompressSync(content, {
    params: {
      [constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY,
      [constants.BROTLI_PARAM_SIZE_HINT]: content.length,
    },
  });
}

export default function brotliPlugin(eleventyConfig, options = {}) {
  const extensions = options.extensions ?? DEFAULT_EXTENSIONS;

  eleventyConfig.on("eleventy.after", async ({ directories }) => {
    const files = await findFiles(directories.output, extensions);

    await Promise.all(
      files.map(async (file) => {
        const content = await readFile(file);
        await writeFile(`${file}.br`, compress(content));
      })
    );
  });
}
