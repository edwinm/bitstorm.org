<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom"
                xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <title>
                    <xsl:value-of select="/rss/channel/title"/>
                    <xsl:value-of select="/rss/channel/title"/>
                </title>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1,shrink-to-fit=no"/>
                <style type="text/css">
                    html {
                    font-family: sans-serif;
                    }
                    h1 {
                    text-transform: uppercase;
                    }
                </style>
            </head>
            <body>
                <header>
                    <h1>RSS feed</h1>
                    <h2>
                        <xsl:value-of select="/rss/channel/title"/>
                    </h2>
                    <p>
                        <xsl:value-of select="/rss/channel/description"/>
                    </p>
                </header>
                <main>
                    <xsl:for-each select="/rss/channel/item">
                        <article>
                            <p>
                                <a hreflang="en">
                                    <xsl:attribute name="href">
                                        <xsl:value-of select="link"/>
                                    </xsl:attribute>
                                    <xsl:value-of select="title"/>
                                </a>
                            </p>
                        </article>
                    </xsl:for-each>
                </main>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>