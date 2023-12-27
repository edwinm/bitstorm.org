---
title: "Multi-video chat written during Fronteers hackaton"
tags:
- webdev
- {tag}
- {tag}
- {tag}
- {tag}

date: 2012-05-20T12:33
---

Yesterday I participated in the Fronteers Hackaton in The Hague. To warm us up Vasilis van Gemert gave a presentation about CSS3-effects featuring some [creatures with laser-eyes](http://vimeo.com/42451941) and Peter Nederlof made them interactive with Node.js.

I really wanted to do something with Node.js too and together with Arjen Geerse, JoÃ«l Kuijten and Sander Elias, we formed a team and came up with the idea to make a multi-video chat.

I wrote the server-side code using [Node.js](http://nodejs.org/) and [Socket.IO](http://socket.io/). It was a simple broadcast-mechanism using the socket.io events. The others wrote the frontend and the getUserMedia interface to the camera. GetUserMedia is pretty new and in our setup only worked with Google Chrome Canary.

After everybody wrote his part, we had to merge all parts together and just ten minutes before presentation time, we got the multi video chat really working. The jury Vasilis and Peter has chosen our team to be the winner of the Hackaton :-)

Afterwards, a couple of us went to a nice little restaurant for dinner to end this very nice day.
