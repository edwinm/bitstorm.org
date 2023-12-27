---
title: "testproxy: testing sites on devices without configuration"
tags:
- webdev
- {tag}

date: 2017-07-01T16:22
---

A while ago I was working on several websites in a Vagrant container. The problem was that we couldn't test the sites on mobile devices. The IP address of the Vagrant box was known inside my computer, but not outside, on other devices. I could use a proxy like Squid, but it was too big, had to be configured and couldn't be installed with npm, like the other tools. I wrote a simple tool in Node to provide the necessary functionality.

Now, I have complete rewritten the tool, named it testproxy and released it under an open source license.

What makes testproxy different compared to other proxies is that is doesn't need any configuration.

For example, you have added test.mycompany.com to your hosts file, which points to your Vagrant container. In you browser, you can visit http://test.mycompany.com to see the website in the container.

But typing in http://test.mycompany.com on a mobile device or other computer won't work, you need a proxy.

Type:

~~~bash
testproxy http://test.mycompany.com
~~~

And it will return an URL and a QR code. Type the URL in the browser of another device or scan the QR code and presto: the website will show up.

This doesn't only work with Vagrant, but will all virtual machines like VMWare, Parallels, VirtualBox and Docker.

There's only one condition to make this work: the device with the virtual machine and the device on which the view the website should be on the same (WiFi) network.

To install testproxy:

~~~bash
npm install -g testproxy
~~~

