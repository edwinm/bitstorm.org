---
title: What I dont like about PHP
layout: page
permalink: /edwin/en/php/index.html
eleventyExcludeFromCollections: true
description: A critique of PHP listing 12 flaws — poor performance, inconsistent design, and scalability issues 
---

[Edwin Martin](/edwin/) <[edwin@bitstorm.org](mailto:edwin@bitstorm.org)>

*Published: August 6th, 2004; Last update: October 23th, 2010.*

I have been developing in PHP since 2001. PHP is very easy to program in. But PHP also has some serious flaws.

Below I give some reasons why you have to do some serious thinking before implementing a large scale web application in PHP.

## 1. Bad recursion

Recursion is the mechanism in which a function calls itself. This is a powerful feature which can make something complex something simple. An example of a function using recursion is [quicksort](http://en.wikipedia.org/wiki/Quicksort). Unfortunately, PHP is not good at recursion. Zeev, one or the developers of PHP, says this: *"PHP 4.0 (Zend) uses the stack for intensive data, rather than using the heap. That means that its tolerance recursive functions is significantly lower than that of other languages."* [See bug 1901](http://bugs.php.net/bug.php?id=1901). This is a poor excuse. Every programming language should provide good recursion support.

## 2. Many PHP-modules are not thread safe

A couple of years ago, Apache released [version 2.0](http://httpd.apache.org/docs-2.0/new_features_2_0.html) of its web server. This version supports multithreaded mode, in which one piece of software can run multiple times simultaneously. The makers of PHP say that the core of PHP is thread safe, only the non-core modules often aren't. But nine out of ten times, you do want to use such a module in your PHP-script, making your script unsuitable for Apache's multithreaded mode. And according to some, even the [core of PHP isn't thread safe](http://neosmart.net/blog/2008/dont-believe-the-lies-php-isnt-thread-safe-yet/). So it is no surprise the PHP Group [doesn't recommend running PHP on Apache 2 in multithreaded mode](http://www.php.net/manual/en/install.unix.apache2.php). The bad multithreaded mode support of PHP is often seen as the reason Apache 2 still didn't catch on.

Read the discussion about this on [Slashdot: Sites Rejecting Apache 2?](http://apache.slashdot.org/apache/02/09/09/209235.shtml?tid=148)

## 3. PHP is crippled for commercial reasons

The performance of PHP can be increased to 500% by using caching [[benchmarks](http://talks.php.net/show/acc_php/20)]. So why is caching not build into PHP? Because Zend, the maker of PHP is selling its own [Zend Accelerator](http://www.zend.com/store/products/zend-platform/) and of course, they don't want to cannibalize on their own commercial products.

But there is an alternative: [APC](http://pecl.php.net/package-info.php?package=APC).

## 4. No namespaces

Suppose someone creates a PHP-module that can read files. One of the functions in this module is called read. And someone else's module can read web pages and also contains a function read. Then it is impossible to use these modules together because PHP will not know which read function you want.

An easy solution to this is namespaces. It was a suggested feature for PHP 5, but unfortunately [it didn't make it](http://www.php.net/ChangeLog-5.php#5.0.0b2). Now, without namespaces, every function has to be prefixed with the module name, to prevent name collisions. This leads to terrible long function names like [xsl_xsltprocessor_transform_to_xml](http://www.php.net/manual/en/function.xsl-xsltprocessor-transform-to-xml.php) which makes code harder to write and read.

Finally, since version 5.3 PHP has namespaces. Unfortunately, as a level separator, it uses the backslash (`\`) character, normally used to escape other characters.

## 5. Non-standard date format characters

Many programmers are familiar with the [date format characters](http://unixhelp.ed.ac.uk/CGI/man-cgi?date) known from UNIX and the C programming language. Other programming languages adopted this standard, but strangely enough, PHP has its own, completely incompatible date format characters. While in C, `%j` stands for the day of the year, [in PHP](http://www.php.net/manual/en/function.date.php) this stands for the day of the month. To make things even more confusing: the function [strftime](http://www.php.net/manual/en/function.strftime.php) and the [date_format](http://smarty.php.net/manual/en/language.modifier.date.format.php) of Smarty, a PHP templating engine, do use the C/UNIX format characters.

## 6. Confusing licenses

You might think PHP is free and all [PHP-modules](http://www.php.net/manual/en/) in the manual are free too. Wrong. For example, if you want to generate a PDF-file from PHP you will find two modules in the manual: [PDF](http://www.php.net/manual/en/ref.pdf.php) or [ClibPDF](http://www.php.net/manual/en/ref.cpdf.php). But both come with commercial licenses. So for every module you use, you have to make sure you agree with its license.

## 7. Inconsequent function naming convention

Some function names consist of more than one word. There are three conventions for combining these words:

1. Glued together: `getnumberoffiles`
2. Separated with underscores: `get_number_of_files`
3. Camel case: `getNumberOfFiles`

Most languages choose one of these variants. PHP uses all of them.

For example, if you want to convert special characters to HTML entities, you use the function *htmlentities* (words glued together). If you want to do the opposite, you use its little brother function *html_entity_decode*. For some reason the words are now separated by underscores. Why is this bad? You know there is a function named `strpad`. Or was it `str_pad`? Every time you have to look up what the notation is or wait for an error to occur. Functions are case insensitive, so for PHP there is no difference between *rawurldecode* and *RawUrlDecode*. This is bad too, because both are used and because they look different, they will confuse the reader.

## 8. Magic quotes hell

Magic quotes prevents PHP-scripts from SQL injection attacks. That's okay. But for some reason, you can turn this off in the `php.ini` configuration file. So if you want to write a portable script, you always have to check whether magic quotes is turned on or off. So a "feature" to make programming easier, actually makes it more complex.

## 9. Framework seldom used

A website without a framework and that's growing, will eventually become a maintenance nightmare. A framework can make a lot of work easier. The most popular model for a framework is the MVC-model, in which layout, business logic and interaction with the database are separated.

Fortunately, since this article was written, in 2004, a lot has changed. In 2004, frameworks were something obscure in the PHP community. Most programmers had to write something themselves. Now things are different.

Zend, the developer of PHP, created a framework [Zend PHP Framework](http://framework.zend.com/). Other frameworks, like [CakePHP](http://www.cakephp.org/), [CodeIgniter](http://codeigniter.com/) and [Symfony](http://www.symfony-project.com/) are also very popular. Only the Zend framework is really object-oriented. The other frameworks support PHP 4 and thus can't be really object oriented.

## 10. No Unicode

With Unicode it is possible to use every language in the world, for example Chinese, Arabic and Hebrew. While every other serious programming language supports Unicode for many years, PHP still has a [very hard time](http://www.phpwact.org/php/i18n/utf-8) dealing with this. [Unicode is planned for PHP 6](http://www.zend.com/zend/week/php-unicode-design.txt) and we still have to [wait a long time](http://lwn.net/Articles/379909/) before PHP supports this trivial feature.

## 11. Slow

You think Java is slow? [PHP is much slower](http://www.caucho.com/articles/benchmark.xtp)! See this [Computer Language Shootout](http://shootout.alioth.debian.org/debian/benchmark.php?test=all&lang=java&lang2=php). So how can PHP be used on all these popular websites with lots of visitors? Because of caching. These sites use [memcached](http://memcached.org/) and [APC](http://pecl.php.net/package/APC) to get performance. It doesn't proof anything about PHP, only that it's cachable.

Even Rasmus Lerdorf, the creator of PHP, admits this. In this [interview from SitePoint](http://www.sitepoint.com/blogs/2008/08/29/rasmus-lerdorf-php-frameworks-think-again/), Rasmus is asked about how to make PHP fast. He answers "Well, you can't".

## 12. Shared Nothing

A slow interpreter wouldn't be a big problem if you could solve it by adding a couple of extra servers. How easy is that? PHP doesn't have threads and you can't share data between different PHP-processes. PHP-supporters call this the "Shared Nothing-architecture". Very smart to sell a shortcoming as an advantage. Just like any other system, you have to share data and in PHP, you do it through the database. Is moving this problem to the (already slow) database really the right solution? I don't think so.

A simple PHP script can become less than 100kB. But a single page in a serious system or in a CMS can easily become 15MB (yes: megabytes). For every request, this memory has to be initialized, which takes time. It also limits the number of concurrent connections. If you have 2GB available for PHP, you can only have 2000/15 is 133 simultaneous connections. Not much, really.

In the SitePoint-interview mentioned above, Rasmus also claims PHP doesn't scale.

Facebook is a nice case to proof this. Facebook is probably the biggest PHP-site. They have [2.3 billion](http://siteanalytics.compete.com/facebook.com/) visits per month. They also use [30 thousand](http://www.datacenterknowledge.com/archives/2009/10/13/facebook-now-has-30000-servers/) servers. That's a lot. If you do some calculations, you'll find out, on average, one server handles only 104 visits per hour. That's really poor performance.

And it gets even more absurd. Last year [Facebook doubled the number of servers](http://www.downloadsquad.com/2010/06/29/facebook-doubles-its-server-count-from-30-000-to-60-000-in-just-6-months/). I doubt they doubled the number of visitors.

## Conclusion

PHP has two advantages: it's very easy and it's widely supported by webhosting companies. But that doesn't make it a good language.

For very small projects, it can be a nice programming language. But for larger and more complex projects, PHP can show its weakness. When you search long enough, you'll find solutions (work arounds) to some of the mentioned problems. So when a solution is known, why isn't it fixed? And why are the fixes not mentioned in the manual?

It's good that an open source language is very popular. Unfortunately, it's not a great language. I hope all problems will be solved once (in PHP 6?) and we will have an open source language that's open source *and* good.

Until then, when you start a project larger than five scripted pages, you might also consider [C#/ASP.Net](http://msdn.microsoft.com/netframework/) or [Java/JSP](http://java.sun.com/j2ee/) as a better solution. And if you want really good (distributed) performance, you can look at some initiatives which have been popping up the last couple of years. Just to mention a couple of them: [Nginx](http://wiki.nginx.org/Main), [Couch DB](http://couchdb.apache.org/) and [Node.js](http://nodejs.org/). They all blow existing systems away.

After I wrote this page, some people informed me about other, similar pages:

- [Experiences of Using PHP in Large Websites](http://www.ukuug.org/events/linux2002/papers/html/php/index.html)
- [I'm sorry, but PHP sucks](http://maurus.net/work/php-sucks/)
- ["PHP in contrast to Perl"](http://tnx.nl/php)
- [I hate PHP](http://keithdevens.com/weblog/archive/2003/Aug/13/HATE-PHP)
- [PHP Annoyances](http://lumphammer.net/articles/phpannoyances/)