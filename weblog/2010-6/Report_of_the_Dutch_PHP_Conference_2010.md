---
title: "Report of the Dutch PHP Conference 2010"
tags:
- webdev
- {tag}
- {tag}

date: 2010-06-13T13:40
---

For the third time, I visited the <a href="http://phpconference.nl/">Dutch PHP Conference</a>. Just as before, it was held in the RAI Convention Centre in Amsterdam. And as before, this two-day conference took place on Friday and Saturday. I always wonder why it's Friday and Saturday. Is it that if your employer or school doesn't let you go on Friday, you can at least go on Saturday? Or if your employer does let you go, you can trade in your work day, but you don't have to trade in your free Saturday? Being a free lancer, it's not really an issue for me, so I went both days.

The conference has three tracks, so planning which presentations to see is a task on itself. There was also an unconference-track. Because during the whole conference there was always something interesting in the regular tracks and because you never know what the quality of the unconference-track will be, I didn't visit any unconference-track.

##Friday

The conference started with a keynote from Kevlin Henney, editor of <strong><a href="http://oreilly.com/catalog/9780596809492">97 Things Every Programmer Should Know</a></strong>. This book contains little pieces of wisdom written by different programmers. Kevlin took a couple of them and explained them. For example how to make estimates, how to have code reviews, why you shouldn't change code on the production server, why you should test, etcetera. Very informative, especially if you haven't already learned it the hard way.

The first talk in a track was <strong>Designing for Reusability</strong> by PHP-contributor and XDebug-developer Derick Rethans. He talked about how to prevent hard dependencies, why singletons are bad for testing, the problems of ActveRecord and why traits will be a solution. Very intersting talk.

The second talk was <strong>The Cake Is A Lie</strong> by Sebastian Bergmann. It was not a talk about how bad CakePHP is, but more a opinion about how bad generated code is. I couldn't really relate to his problems. I've worked on a large project in which the ORM-code was generated. In this project, we didn't change the generated code but instead we inherited from it and it was nice to work with. Sebastian did not present any alternatives.

I was a bit dissapointed by <strong>The Art of Scalability</strong>, a talk from Lorenzo Alberton, and I think I was not the only one. He didn't talk about scalability from a technical point of view, but from a management point of view.

In <strong>Under PHP's hood</strong>, Johannes SchlÃ¼ter talked about the inner workings of PHP. He explained how the Zend engine and PHP Core are seperate things. He explained the difference between include and require and the -_once-variants. He also explained how references work and why you should keep having references to a minimum. He also showed how it can even hurt performance.

Although I've never used GIT, I thought visiting <strong>Advanced Git</strong> from David Soria Parra might be interesting anyway. He adviced to make a branch for every task you do. And only rebase local branches, never pulled or pushed branches. I don't know what pulled or pushed branches are, but when I'm start using GIT, I know this tip :-) He said GIT doesn't work well on Windows because FAT doesn't support symlinks and execute-bits. Huh? Which Windows-user still uses FAT, except from portable storage? A strange assertion, I think.

The talk <strong>Crash, Burn, Recover!</strong> from from Cal Evans showed Flex using Flash Builder. He build a recipe search app from scratch. Well, at some point it didn't work and he had to revert to a prepared app. He showed the power of Flash Builder and how you can build a program in one hour. The result can be deployed as a Flash swf-file or a AIR application. It was nice to see how Flex works.

I didn't go to the DPC Conference Social that evening (with free beer!). Maybe next year.

##Saturday

The second day started off with <strong>Security-Centered Design: Exploring the Impact of Human Behavior</strong> by Chris Shiflett. He showed, nicely illustrated, how humans are sensitive to certain kind of security attacks. He explained Ambient signifiers: how you can subconsciously direct your users. For example, in Tokyo they introduced different kinds of background music in the subway, depending on where you are. It turned out that as a result, many more people didn't forget to leave the train on time, resulting in a more profitable subway system (and, of course, happier customers). He showed the movie <a href="http://www.youtube.com/watch?v=vBPG_OBgTWg">Person Swap</a> and the <a href="http://www.youtube.com/watch?v=voAntzB7EwE">Colour changing card trick</a>, which shows how easy it is to deceive people. He also explained the <a href="http://www.darkreading.com/security/vulnerabilities/showArticle.jhtml?articleID=213000919">Twitter Clickjacking Hack</a>. Although it didn't really had much to do with PHP, it was a very good presentation.

The next talk I visited was <strong>Async webservices with php and node.js</strong> by Sebastian SchÃ¼rmann. He showed how asynchronous calls can improve performance and how it is done in PHP, compared to Node.js. He showed an example in PHP with Curl and an example in Node.js. The Node.js-example was much cleaner and easier. Other asynchronous API's in PHP are the Streams API and <a href="http://dev.mysql.com/downloads/connector/php-mysqlnd/">MySQLnd</a>. He did a call to the developers of PHP to make asynchronous programming in PHP as easy as in Node.js.

In the talk <strong>APC & Memcache the High Performance Duo</strong>, Ilia Alshanetsky explained how APC works and how you can use it as a persistent key-value store. He also compared it to Memcache and explained what the differences are. He also explained the advantages and disadvantages of <a href="http://opensource.dynamoid.com/">igbinary</a>: it's much faster and smaller, but not interchangeable with other languages. For me this was the most interesting and informative talk of this conference.

After the lunch Ian Barber had a talk about local search engines: <strong>In Search Of... Integrating Site Search</strong>. He showed the pros and cons about the most popular onces: sphinx, swish-e, lucene, solr and xapian. He also showed the importance of a good stemmer.

The last talk I visited was <strong>Plant Pyrus in your system - A guide to a plugin system</strong> by Helgi Ãžormar ÃžorbjÃ¶rnsson. He explained how hard it is to develop your own plugin system which has to deal with dependencies. He worked on Pyrus, which you can integrate in your own software and should also become part of PEAR.

The conference ended with a panel discussion about the future of PHP.

Just like the years before, it was a very interesting conference with something for everybody. I'm quite sure I'll be there again next year.

