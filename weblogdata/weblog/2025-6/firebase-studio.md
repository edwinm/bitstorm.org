---
title: "Vibe coding with Firebase Studio"
date: 2025-06-14T22:02
tags: featured
---

Last April (2025), Google [introduced](https://firebase.blog/posts/2025/04/introducing-firebase-studio/) Firebase Studio.
It is an AI tool that allows you to create (web) apps by giving prompts, just like with ChatGPT.
There are other vibecoding tools, such as [Bolt](https://bolt.new/) and [Lovable](https://lovable.dev/),
but unlike Firebase Studio, they are limited to a number of prompts/tokens per day or month in the free versions.
In this article, I share my experiences with Firebase Studio.

## Experiences

I didn't really know what to expect.
Getting metadata of an image would be an easy start, I thought.
I typed: "create an ui with a drop area where files can be dropped and a list below with details of dropped files".

Firebase Studio came up with an App Blueprint, which is a list of the app's features, the style and the stack to use. I chose Next.js as the stack,
but I could also choose Go, Python Flask, Java, .Net, Node.js Express and a few others.
The App Blueprint can be changed before the app is generated.

I clicked the prototype button and a few minutes later the app was generated and ready to use.
I dragged a few files into the drop area and a list of the images with details appeared. It worked perfectly!

Then I gave some commands to adjust the style and add features one by one.
At one point an error occured during the app generation.
It asked me to fix it myself or let Firebase Studio fix it.
Of course I let Firebase Studio fix it. If I'm vibe coding, then I'm vibe coding.
After Firebase Studio fixed the error, the app was generated again and everything worked fine.

When I asked to show EXIF information of the image, Firebase Studio said it would just add a text:
"Include a small note that full EXIF data parsing is more complex and typically requires dedicated libraries".
Firebase Studio seemed reluctant to use libraries, which was odd.
Let's see what happens when I explicitly asked it to add the EXIF library.
Now it complied, it included the EXIF library and after generating the app, the EXIF data was displayed. Yay!

In an AI tool, you expect to use other AI tools.
I asked it to recognize texts in the image and translate them to English if necessary, which both worked great.

Within half an hour I had a working app!

{% image 'filedrop.png', 'Screenshot of FileDrop app', 'Screenshot of FileDrop app', 800 %}

Continuing with the drag-and-dropping of images and processing them, I created two more apps: an HTML image tag generator and
an app to make a smart crop of an image.

The image tag generator also automatically generates the alt attribute based on the contents of the image.
That worked very well.

{% image 'imagetag.png', 'Screenshot of ImageTag app', 'Screenshot of ImageTag app', 800 %}

The app to make image crops was a bit more complex and took me the most work. 
The idea was to recognize important parts of an image, such as a face,
and make sure they were included in the crop. I tried many different wordings, but more often than not it didn't work as I would expect.
The "smart" crop would often appear on random places within the image.

With this app I also noticed that when you ask to fix something sometimes another feature breaks (again).

{% image 'crop.png', 'Screenshot of Smart Crop app', 'Screenshot of Smart Crop app', 800 %}

## Code

What makes Firebase Studio powerful is that you can switch between a code editor and the vibe editor.
The quality of the generated code is better than I expected. The code is structured, the variables and functions have good names
and React best practices are followed.

Below is a piece of code from the app that can crop images.
Tailwind, which blows up the code a bit here, can also be disabled (in advance).

```typescript jsx
  const resetApplication = () => {
    clearAllFiles();
    toast({
        title: "🎉 Fresh Start!",
        description: "FileDrop FunZone is reset and ready for more action!",
    });
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8 selection:bg-accent selection:text-accent-foreground">
      <div className="w-full max-w-4xl space-y-6">
        <header className="text-center space-y-2 py-6">
          <h1 className="text-5xl font-bold text-primary tracking-tight flex items-center justify-center">
            <Sparkles className="h-10 w-10 mr-3 text-accent animate-pulse" />
            FileDrop <span className="text-accent">HappyZone!</span>
          </h1>
          <p className="text-muted-foreground text-xl">
            Drag, drop, and discover the magic within your files!
          </p>
        </header>

        <FileDropzone onFilesAdded={handleFilesAdded} disabled={isProcessingDrop} />
        
        <Separator className="my-6" />

        {uploadedFiles.length > 0 && (
          <div className="flex justify-end space-x-3 mb-4">
             <Button variant="outline" onClick={resetApplication} disabled={isProcessingDrop || uploadedFiles.length === 0} className="rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <RotateCcw className="mr-2 h-5 w-5" /> Reset FunZone
            </Button>
            <Button variant="destructive" onClick={clearAllFiles} disabled={isProcessingDrop || uploadedFiles.length === 0} className="rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Trash2 className="mr-2 h-5 w-5" /> Clear All Files
            </Button>
          </div>
        )}
        
        <FileList files={uploadedFiles} />
        
        <footer className="text-center text-md text-muted-foreground mt-10 py-6 border-t">
          <p>&copy; {new Date().getFullYear()} FileDrop FunZone. Built with Next.js, GenAI, and a sprinkle of joy!</p>
        </footer>
      </div>
    </main>
  );
```

The code can also be integrated with Git.
I have created a repo for both [image tag generator](https://github.com/edwinm/image-tag-generator/) and [FileDrop](https://github.com/edwinm/FileDropFunZone),
so you can take a look at the code yourself.

## Publish

At the top of the page is a Publish button. You can easily publish the app to the Google cloud and make the app available to everyone.
You will have to enter your credit card details first. I was a bit skeptical about the costs, but you can try Google Cloud for free for 90 days.
You do not have to pay any costs up to US$300.
It turned out to be very cheap.
Generating and trying out the apps did cost me only a few cents per month so far, which
are not charged, because of the free trial.

You also get all the tools that Google Cloud offers. Such as extensive logging. I saw several error messages in the log,
but they turned out to be pages that were requested but did not exist, so it was not a problem.

## Custom domains

I assigned custom domains to the apps. This is the instruction I got to do this:

{% image 'setup-domain.png', 'Instructions to assign a custom domain name', 'Screenshot of instructions', 800 %}

If I would follow the last two lines, my website wouldn't work anymore. That's a bit strange.
And I had to change the dots at the end of the domain names in the first instruction.
It seems they are a bit too eager to push things (untested) to production.
Fortunately, I got it to work with only the first two (adjusted) lines.

You can use the apps yourself here:

- [File Drop](https://filedrop.bitstorm.org/)
- [Image Tag Generator](https://imagetag.bitstorm.org/)
- [Image Smart Crop](https://smartcrop.bitstorm.org/)

## Conclusion

Firebase Studio works very well, at least for simple apps. And then Firebase Studio has many more possibilities that I have not tried yet.
With more complex apps such as the Smart image cropper, previously solved bugs later returned.
Is it suitable for large, complex applications? I don't know yet.
When using Git, you can always go back to a previous version so you don't end up playing Whac-A-Mole with bugs.

For now, Firebase Studio is ideal for prototyping an app and I even see a use case for creating a single use app that takes boring and repetitive work off your hands.
I'm sure Firebase Studio will improve over time.

Will developers lose their jobs? Not very soon.
I think a developer using a tool like Firebase Studio is a powerful combination that will be in demand for a long time.

I have to say that I am very impressed with Firebase Studio. Try it out yourself:

- [Firebase Studio](https://firebase.studio/)