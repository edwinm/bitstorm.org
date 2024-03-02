---
title: "Introduction to Intl, the ECMAScript internationalization API"
date: 2022-12-20T15:24
media:
   - image: "meme.jpg"
     caption: "Intl is being undervalued"
     alt: "Boyfriend looking at other woman meme with other woman being moment and luxon and the girlfriend being Intl" 
---

Developers often complain when they have to support time zones or daylight saving time.
The time they want to show differs by one (or more) hour from the time
is in the data. Sometimes they solve this by adding the difference themselves,
not knowing that this only made the problem worse and the time after the next one
summer-winter time change is probably incorrect again.

While the solution is very simple. Always save time as GMT, so without time zone offset and without daylight saving time. You can use the Unix epoch for this, which is the number of seconds since January 1, 1970 GMT.

_Tip: don't use a 32-bit integer for this, because then you will have a problem again in 2038._

From this GMT time you can easily display the local time with JavaScript. The Date object has long had functions to display both the time and date in the desired locale
(date.toLocaleDateString(), date.toLocaleString() and date.toLocaleTimeString()).
Unfortunately, you cannot deviate from the standard time/date display of these functions.

If you want to influence how the time is displayed, you could (in the past) write something yourself or turn to JavaScript libraries. A widely used library that can also handle time zones and daylight saving time is Moment.js.

## Moment.js

Since 2016, all browsers support Intl, the ECMAScript internationalization API.
With Intl you can display dates and times in many different ways, taking into account
with time zones and summer time and in different languages. And that's just part of it
what Intl can do.

Yet I see many developers still working with Moment.js.
It is understandable that once you know an API well, you are reluctant to switch
on another API.

There are a number of good reasons to switch, because Moment has a number
cons:

1. Moment.js is outdated and no longer being developed

_"We recognize that many existing projects may continue to use Moment, but we would like to discourage Moment from being used in new projects going forward."_

As can be read on the [Documentation page](https://momentjs.com/docs/)
Further explanation of this decision can be found on their [Project Status page](https://momentjs.com/docs/#/-project-status/).

2. Moment.js contains all time zone and daylight saving time data for all countries
   quite big.

3. Moment is not suitable for tree shaking, so you always load the entire library,
   no matter how much you use it.

4. Moment.js is not immutable. If you have a time x and you want the time to be two hours
   calculate later, the value of x will change, which is usually not what you want.
   Once you know this, you care
   that you first make a copy of x, but it remains inconvenient.

5. A reason I don't see in other places: because of the time zone and daylight saving time data
   in your JavaScript, they cannot be easily modified.
   With a few hundred countries you can imagine that this data changes regularly,
   but if you only update your JavaScript libraries occasionally, or at worst
   never, then you know that you will soon end up with outdated data.

## Erdogan time

An interesting example took place in Turkey in 2015. Winter time would start
October 25, but because there were elections on November 1, this was made a few weeks in advance
moved to November 8, so that there was an extra hour of light for voters.
Microsoft, Apple, Google (Android) released updates quickly, but as you can imagine,
not all systems were updated on time. The Turks lived with it for two weeks
part of the clocks on normal time and another part on "Erdogan time".

See also Matt Johnson-Pint's On the Timing of [Time Zone Changes](https://codeofmatt.com/on-the-timing-of-time-zone-changes/) for other examples
of time zone chaos. 

By putting the time zone and daylight saving time data hardcoded in JavaScript on your website
you're not really making the problem any smaller.

Instead of Moment.js you can also use a more modern library such as Luxon, which
is based on Intl. But why wouldn't you use Intl right away?

## Intl

Intl may seem a bit complicated at first glance, but as you can see below,
that's not so bad.

Here's an example:

```javascript
// Take any date object
const date = new Date(Date.UTC(2022, 11, 25, 11, 30, 00));

// Create a DateTimeFormat
const dateTimeFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long' })

// Format the provided date
dateTimeFormat.format(date)

// returns "Sunday, 25 December 2022 at 12:30:00 CET"
```

The first parameter of DateTimeFormat is the locale. That is the language in which the date
should be displayed, not to be confused with the time zone. Usually this is the language of the page
itself, but if you want to use the user's language setting, you can set value
pass `undefined`.

The second parameter contains the options. The following values are possible for both dateStyle and timeStyle: "full", "long", "medium" and "short".

If that is not enough, you can also indicate for each part of the date how it should be displayed. For example, for the month you can give month the following values:

```text
  "numeric" (e.g. 3)
  "2-digit" (e.g. 03)
  "long" (e.g. March)
  "short" (e.g. Mar)
  "narrow" (e.g. M)
```

If you want to display the date for a specific time zone, you can specify the timeZone option, for example timeZone: "Asia/Tokyo".

Almost every conceivable date format is possible. For the list of all possible options, see the [Intl.DateTimeFormat() constructor page](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat).

format() always returns a string, but what if you want to display the seconds in a smaller font? Or AM/PM in a different color? That is also possible. Instead of format(date), call formatToParts(date) and you will get an array of all date parts and their values. You can then decide how to display each of these values.

```javascript
dateTimeFormat.formatToParts(date);

//returns
[
   { type: "weekday", value: "Sunday" },
   { type: "literal", value: ", " },
   { type: "day", value: "25" },
   { type: "literal", value: " " },
   { type: "month", value: "December" },
   { type: "literal", value: " " },
   { type: "year", value: "2022" },
   { type: "literal", value: " at " },
   { type: "hour", value: "12" },
   { type: "literal", value: ":" },
   { type: "minute", value: "30" },
   { type: "literal", value: ":" },
   { type: "second", value: "00" },
   { type: "literal", value: " " },
   { type: "timeZoneName", value: "CET" }
]
```

In addition to DateTimeFormat, Intl contains a series of options that are useful for internationalization.

## RelativeTimeFormat

Relative time, as you often see on forums and chat channels.

```javascript
// Create a RelativeTimeFormat
const rtf = new Intl.RelativeTimeFormat('nl-NL');

rtf.format(-2, 'minute')
// returns "2 minutes ago"
```

## ListFormat

Displaying lists in the desired language.

```javascript
// Create a ListFormat
const listFormat = new Intl.ListFormat('nl-NL', { style: 'long', type: 'conjunction' });

listFormat.format(["bananas", "apples", "tangerines"])
// returns "bananas, apples and tangerines"
```

In addition, with Intl you can also display numbers correctly, depending on the language, apply plural rules, sort alphabetically and divide text into words (among other things).

If you want to get started with the Intl API and view all the possibilities, you can, as always, consult the good documentation on [MDN](https://developer.mozilla.org/en-US/).

But if you want to discover the Intl API interactively, you can try out [Intl Explorer from Jesper Orb](https://www.intl-explorer.com/?).

And if you are thinking "that Intl API is very nice, but the Date API could also be a bit better", then I have good news: the [Temporal API](https://tc39.es/proposal-temporal/docs/) is currently being worked on, which will replace the old Date API.