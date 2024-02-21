---
title: "Faster websites with gzip compression"
date: 2010-05-10T16:33

---

One of the best ways to improve the user experience of a website is to make sure it loads fast. In a <a href="http://blog.mozilla.com/metrics/2010/03/31/firefox-page-load-speed-part-i/">test done by Mozilla</a>, it also improves conversion. <a href="http://googleresearch.blogspot.com/2009/06/speed-matters.html">Research by Google</a> also shows advantages.

One of the easiest ways to improve download speed is using gzip. Since many webbased files like html, css and javascript are text based, compressing them with gzip will result in more than 50% size reduction.

<a href="http://schroepl.net/projekte/mod_gzip/browser.htm">Older browsers</a> had some problems with gzip, so site owners where a bit reluctant to use gzip. Currently, all modern browers (even IE with the right service pack applied) have no problem with using gzip.

Apache has a module called <a href="http://httpd.apache.org/docs/2.0/mod/mod_deflate.html">mod_deflate</a>, which is easy to enable. For example:

```
AddOutputFilterByType DEFLATE text/html text/plain text/xml text/javascript text/css
```

Mod_deflate will compress the content on the fly for every request. On a high-performance site, that's not really what you want. There are better ways.

##Compressing static content

First you have to compress all text files. Typically, there are files ending with .html, .css, .js and .xml. When using Linux, make sure you have gzip installed. Don't just gzip the files you want to compress, because the original file will be gone. Better is to do this:

```bash
gzip -nc myfile.css >  myfile.css.gz
```

Disadvantage is, you can't do this with a bunch of files. I wrote a little script to fix this:

```bash
echo -n $@ | xargs -d ' ' -I '{}' sh -c "gzip -n -c {} > {}.gz"
```

Put it in a file, for example /usr/local/bin/zipit, make it executable: chmod +x /usr/local/bin/zipit and now you can use it to compress single files, but also files with wildcards. For example:

```bash
zipit *.js *.css
```

If you had lib.js and style.css, now you will also have the compressed versions: lib.js.gz and style.css.gz.

<p class="warning">
Warning: you have to be careful here: uploading a new .js- or .css-file won't work! You have to run zipit again, otherwise the .gz-file with the old content might be picked up.</p>

In Windows, you can gzip your files in a batchfile. You can use the free <a href="http://www.7-zip.org/">7-Zip</a> to to that. For example:

```bash
"C:\Program Files\7-Zip\7z.exe" a -tgzip style.css.gz style.css
```

##Zopfli

Update March 12th, 2013: the compression algorithm has been improved. It's called zopfli. The nice thing is that the resulting file is still a valid gzip file and can be decompressed by the existing software. Decrompression doesn't take any longer, too. The resulting file will be around 5% smaller than the best gzip algorithm. The time to compress can be hundred times slower, but since this article is about one time compression, it's still worth the effort.

Download the [Zopfli sources](http://code.google.com/p/zopfli/), run make and copy the resulting file to /usr/local/bin.

To run zopfli on multiple files, you don't need a batch file, just run it like this:

```bash
zopfli -i1000 *.js *.css
```

##Let Apache serve compressed content

There are several ways to let Apache serve the .gz-files. I prefer using mod_rewrite. I wrote the following configuration file to serve the gzipped files:

```apache
<FilesMatch "\.html\.gz$">
  ForceType text/html
  Header set Content-Encoding: gzip
</FilesMatch>

<FilesMatch "\.js\.gz$">
  ForceType text/javascript
  Header set Content-Encoding: gzip
</FilesMatch>

<FilesMatch "\.css\.gz$">
  ForceType text/css
  Header set Content-Encoding: gzip
</FilesMatch>

RewriteEngine On
ReWriteCond %{HTTP:accept-encoding} gzip
ReWriteCond %{REQUEST_FILENAME} !\.gz$
RewriteCond %{DOCUMENT_ROOT}%{REQUEST_FILENAME}.gz -f
RewriteRule ^(.+\.js|.+\.css|.+\.html)$ $1.gz [L]
```

It's quite low-level and therefore very clear. The rewrite rules checks the browser supports gzip, then it makes sure it's not already getting the .gz-file. As a last check it checks for the existance of the .gz-file. If that's the case, the url is rewritten to have .gz at the end. The FilesMatch-directive makes sure the content-type is correct and adds "Content-Encoding: gzip" to the http-header, so the browser knows it's gzipped content.

##Gzip and PHP

Most server-side languages also support gzipped output. PHP has several ways to do that.

If you're using ob_start to buffer the output, you can easily enable gzip-compression by using <a href="http://www.php.net/manual/en/function.ob-gzhandler.php">ob_gzhandler</a>:

```php
ob_start("ob_gzhandler");
```

A better way might be to enable gzip on all PHP-scripts. Just enable <a href="http://www.php.net/manual/en/zlib.configuration.php#ini.zlib.output-compression">zlib.output_compression</a> in your php.ini-file:

```
zlib.output_compression On
```

PHP has quite a lot of <a href="http://php.net/manual/en/book.zlib.php">gzip-related functions</a>. You can easily zip or unzip strings and work with gzipped files as they where normal files.

##Check gzip is working

How can you be sure your content is compressed? Just open the Net-tab within Firebug and reload the page. Open the headers of the file you want to inspect. It will look similar to this:

```
Date                Mon, 10 May 2010 14:19:06 GMT
Server              Apache/2.2.4
Vary                accept-encoding
Last-Modified       Thu, 29 Apr 2010 09:23:59 GMT
Etag                "9043e7-856-afc129c0"
Accept-Ranges       bytes
Content-Length      2134
Cache-Control       max-age=172800 proxy-revalidate
Content-Encoding    gzip
Content-Type        text/html
```

When you see "Content-Encoding gzip" as in the example above, you'll know it is compressed. Or use <a href="http://developer.yahoo.com/yslow/">YSlow </a>or <a href="http://code.google.com/intl/nl/speed/page-speed/">Page Speed</a> and look at the A's you'll get!

