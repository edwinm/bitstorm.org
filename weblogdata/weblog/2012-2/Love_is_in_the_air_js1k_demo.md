---
title: "Love is in the air js1k demo"
date: 2012-02-24T13:46
media:
     - image: "loveisintheair.jpg"
       caption: "Love is in the air"
       alt: "Screenshot of the js1k demo"

---

Currently the fourth [js1k competition](http://js1k.com/2012-love/) is open. It's organized by Peter van der Zee and it's besides a competition, also a showcase of what can be done with 1 kilobyte of JavaScript. Almost all entries use canvas to show off some graphics. This year the theme is love.

This year I also participated. It is a nice way to get some experience with the new canvas feature of HTML5. It reminded me a lot of the time I wrote Basic programs on the Atari 800XL and the Atari ST. The idea of drawing on the screen is still basically the same. On the Atari, you could even draw dotted and dashed lines, which is not possible with canvas. But I understand this will be added soon.

I started with some text I wanted to move. I printed some text on the screen, captured the pixeldata and used that to display larger pixels on the screen. And since the theme is love, I turned the pixels into small hearts. Now let's move the text. I could add a sine wave, but that would be too easy. Let's make it more random. I divided the text into four heights, which could change independently and with different, random speeds. When this was done, I had some 200-300 bytes left. Since the text was already "Love is in the air", he obvious choice was to add some sky and clouds.

I've read about the [Perlin noise algorithm](http://en.wikipedia.org/wiki/Perlin_noise) before, a proven way to get noise and clouds in computer graphics. The simplest form is done with rectangles, which can lead to rectangular clouds. That's not what you want. So why not replace the rectangles with circles? It's just as easy in canvas.

I ended up with six layers of clouds, a nice balance between realism and performance. Speaking about performance: Firefox has a lot of improvement to do. The current demo takes 55% of my CPU, while I know the CPU (and GPU) are highly optimized for this kind of graphical operations. Please use them. Other browsers performed much better.

I used the [Google Closure Compiler](/weblog/2010-8/Introduction_to_the_Google_Closure_Compiler.html) to minify the JavaScript code. One advantage of this was I could write readable JavaScript. I didn't use a lot of tricks to shrink my code. I did use `~~` to convert a float to an int and '2 << layer' to get the power of two. Be very cautious when using these kind of optimizations yourself. Only use them when code size is essential. Readable code is much more important than small code!

Strangely enough, the Closure Compiler made some of my own optimizations undone. When I wrote .4, it was turned into 0.4 in the minified version.

Unfortunately, I already reached 1000+ bytes and couldn't add some blur to the clouds and I also couldn't make the waving movements more smooth with some easeInOut algorithm.

You can find the final [Love is in the air demo here](http://js1k.com/2012-love/demo/1169). It works on all modern browsers: Firefox, Chrome, Safari, Opera, Internet Explorer 9 and even the iPhone and iPad.

Here is the (non-minified) source code:

~~~ javascript
var width, height, fsize, ts, d, h, hd, hi, hx, hy, i, x, y, k, vx, vy;
var layer, pow, air, airLayer, airContext, cloud, airx, size, lw, hdi, path;

width = 1e3;
height = 250; // higher means higher cpu load
c.width = width;
c.height = height;

// Print the text
fsize = 16;
a.font = '16px arial';
a.fillText("Love is in the air", 0, fsize);
ts = 116; // calculated with a.measureText("Love is in the air")
// get pixeldata of the text
d = a.getImageData(0, 0, ts, fsize);

// the waves are four changing heights
h = [50, 0, 99, 0]; // initial values
// hd is the speed of the height change (wave)
hd = [2, -2, 5, 1]; // initial values

// create six cloud layers, the Perlin noise way
// ten or more layers is nicer, but very cpu-intensive
air = [];


for(layer=0; layer<6; layer++) {
    // higher layers have more, smaller clouds
    pow = 2 << layer; // powers of two with bit shifting
    airLayer = air[layer] = document.createElement('canvas');
    airLayer.width = width;
    airLayer.height = height;
    airContext = airLayer.getContext('2d');
    airContext.fillStyle = '#fff'; // white clouds

	// I didn't manage to squeeze some blur in :-|
    //airContext.shadowColor = '#fff';
    //airContext.shadowBlur = 10;

    // every cloud layer has 18*pow circles (clouds)
    for(cloud=0; cloud<18*pow; cloud++) {
        x = Math.random()*width;
        y = Math.random()*height;
        for(i=-1;i<2;i++) { // three times, to wrap the clouds around the edges on the sides
            airContext.beginPath();
            airContext.arc(x+i*width,y,200/pow,0,7); // 7 is full circle Math.ceil(2*Math.PI)
            airContext.closePath();
            airContext.fill();
        }
    }
}

airx=0;

// Profile
//var timestart = Date.now();

setInterval(function () {
    // calculate new heights of waves
    for (hi = 0; hi < 4; hi++) {
        h[hi] += (hdi = hd[hi]);
        // when the height hits top or bottom, turn around
        if (h[hi] < 0 || h[hi] > 99) {
            hd[hi] = (Math.random() * .8 + .4) * h[hi] > 0 ? -1 : 1; // speed of wave effect
            h[hi] -= hdi; // reverse addition to stay within 0-100 range
        }
    }

    // start with a blue sky
    a.globalAlpha = 1;
    a.fillStyle = '#06e';
    a.fillRect(0, 0, width, height);


    a.globalAlpha = .4; // transparency of each cloud layer
    // draw all cloud layers
    for(layer=0; layer<6; layer++) {
        for(lw=0;lw<2;lw++) { // two layers next to each other
            // Use ~~ to align with pixels for performance
            a.drawImage(air[layer], ~~(airx*layer/9%width)-width*lw, 0);
        }
    }



    airx++; // cloud movement

    hx = h[3];
    a.fillStyle = '#e33'; // heart color
    // draw heart in x-axis
    for (x = 0; x < ts; x++) {
        // hx is the strength of the wave effect (0-99)
        // add one tenth of the difference to the height for a slightly smoother effect
        // ~~ is a trick to turn a float in an int
        hx += (h[~~(x / 30) % 4] - hx) / 10;
        // draw heart in y-axis
        for (y = 0; y < fsize; y++) {
            // k is the alphavalue of each heart / pixel in the text (0-50)
            k = d.data[3 + 4 * (x + ts * y)] / 5;
            if (k) {
                a.globalAlpha = k*hx/6000+.1; // alpha value is k and hx combined
                vx = x * 8 + 30.5; // Use .5 to align with pixels
                vy = y * 8 + 50 + (hx / 54 * (y - 23));
                // Draw heart-like shape
                // 1k+ improvement: with bezier curves:
                // See https://developer.mozilla.org/samples/canvas-tutorial/2_6_canvas_beziercurveto.html
                a.beginPath();
                a.moveTo(vx, vy - 1.5);
                path = [3, -3, 6, 0, 0, 6, -6, 0, -3, -3];
                for(i=0; i<10; i+=2) {
                    a.lineTo(vx+path[i], vy+path[i+1]);
                }
                a.closePath();
                a.fill();
            }
        }
    }

// Profile
//    a.fillStyle = '#000';
//    a.globalAlpha = 1;
//    a.fillText(Math.round(airx/(Date.now()-timestart)*10000)/10+' fps', 0, fsize);

}, 50); // 20 fps

~~~

Update: to save more bytes for the fuzzy and realistic clouds, I replaced the drawing of the heart by just printing the Unicode character â™¥. Unfortunately, this made the wave effect stutter a bit. Apparently, text can only positioned at whole pixel values. I even tried use canvas scale, but that didn't help. I see this as a current shortcoming of canvas and I hope browsers will fix this. Hopefully the [sub-pixel rendering in IE10](https://blogs.msdn.com/b/ie/archive/2012/02/17/sub-pixel-rendering-and-the-css-object-model.aspx) will be a start.

You can see my [second version](/weblog/2012-2/js1k/shim2.html), with fuzzy clouds and the heart Unicode character. The JavaScript is larger than 1024 bytes, so it's not a valid JS1K entry.

