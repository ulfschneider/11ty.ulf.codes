const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItTableOfContents = require('markdown-it-toc-done-right');
const markdownItDefList = require('markdown-it-deflist');
const markdownItFitMedia = require('markdown-it-fitmedia');
const markdownItScrollTable = require('markdown-it-scrolltable');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItFootnote = require('markdown-it-footnote');

const cheerio = require('cheerio');
const stripHtml = require('string-strip-html');
const fs = require('fs');
const path = require('path');

const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(advancedFormat);
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc);
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(timezone);


const site = require('../_data/site.js');

module.exports = {

    excerptFromItem: function(item) {
        let excerpt = this.removeHtml(item.templateContent);
        if (excerpt) {
            excerpt = excerpt.split(' ')
                .slice(0, site.excerptWordCount ? site.excerptWordCount : 25)
                .join(' ');
        }
        return excerpt;
    },

    firstImageTag: function(html) {

        if (html) {
            const match = html.match(/<img\s+([^>]*)src="(.*?)"(.*?)[^>]*>/);
            if (match) {
                return match[0];
            }
        }
    },

    getAttr: function(html, attr) {
        if (html) {
            const match = html.match(new RegExp(`${attr}="(.*?)"`));
            if (match) {
                return match[1];
            }
        }
    },

    srcAttr: function(html) {
        return this.getAttr(html, 'src');
    },

    srcsetAttr: function(html) {
        return this.getAttr(html, 'srcset');
    },

    altAttr: function(html) {
        return this.getAttr(html, 'alt');
    },

    widthAttr: function(html) {
        return this.getAttr(html, 'width');
    },

    heightAttr: function(html) {
        return this.getAttr(html, 'height');
    },

    isLiveItem: function(item) {
        const now = new Date();
        return item.date <= now &&
            item.data.draft !== true &&
            item.data.draft !== 'yes';
    },

    isPost: function(item) {
        return item.inputPath.startsWith('./content/posts/');
    },

    tagUrl: function(tag) {
        let standard = {
            tag: '*',
            url: '*'
        };
        let empty = {
            tag: '',
            url: ''
        };
        let siteTags = site.tagnav;
        if (siteTags) {
            for (let v of siteTags) {
                if (typeof v != 'string' && !(v instanceof String)) {
                    if (v.tag == tag) {
                        return v.url;
                    }
                    if (v.tag == '*') {
                        standard = v;
                    }
                    if (!v.tag) {
                        empty = v;
                    }
                }
            }
        }

        if (tag == '') {
            return empty.url;
        } else {
            return standard.url.replace(/\*/g, tag);
        }
    },

    isSearchAble: function(item) {
        if (item.templateContent && item.templateContent.trim()) {
            return item.data.nosearch == null;
        }
        return false;
    },

    removeHtml: function(text) {
        const $ = cheerio.load(text);

        //remove anchors
        $('a.anchor').each(function() {
            $(this).remove();
        });
        return stripHtml($('body').html());
    },

    mapItem: function(item) {
        return {
            id: item.url,
            title: item.data.title,
            date: item.date,
            humanDate: this.humanDate(item.date),
            subtitle: item.data.subtitle,
            abstract: item.data.abstract,
            author: item.data.author,
            layout: item.data.layout,
            tags: item.data.tags,
            notags: item.data.notags,
            starred: item.data.starred,
            content: this.removeHtml(item.templateContent)
        }
    },

    compareItemDate: function(a, b) {
        return a.date - b.date;
    },

    compareInputFileName: function(a, b) {
        const aFileName = path.basename(a.inputPath);
        const bFileName = path.basename(b.inputPath);
        return aFileName.localeCompare(bFileName);
    },

    isoDate: function(d) {
        return dayjs(d).toISOString();
    },

    humanDate: function(d) {
        if (d) {
            const locale = site.locale ? site.locale : 'en';
            let dt = dayjs(d).locale(locale);
            return dt.format('MMM Do, YYYY')
        } else {
            return '';
        }
    },

    humanDateTime: function(d) {
        if (d) {
            const locale = site.locale ? site.locale : 'en';
            let dt = dayjs(d).locale(locale);
            return dt.format('ddd, MMM Do, YYYY hh:mm a Z');
        } else {
            return '';
        }
    },

    extractTags: function(collection) {
        let tagSet = new Set();
        for (let post of collection) {
            if (post.data.tags) {
                for (let tag of post.data.tags) {
                    tagSet.add(tag);
                }
            }
        }
        return [...tagSet].sort();
    },

    getMarkdownLib: function() {
        const mdlib = markdownIt({
                html: true,
                breaks: true,
                linkify: true,
                typographer: true
            })
            .use(markdownItAnchor, {
                permalink: true,
                permalinkClass: 'anchor',
                permalinkSymbol: '#',
                permalinkBefore: false,
                permalinkSpace: true
            })
            .use(markdownItTableOfContents)
            .use(markdownItDefList)
            .use(markdownItFitMedia, {
                imgDir: './content'
            })
            .use(markdownItScrollTable)
            .use(markdownItAttrs)
            .use(markdownItFootnote);

        return mdlib;
    },

    hashCode: function(value, seed = 0) {
        //from https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript/52171480#52171480
        let h1 = 0xdeadbeef ^ seed,
            h2 = 0x41c6ce57 ^ seed;
        str = String(value);
        for (let i = 0, ch; i < str.length; i++) {
            ch = str.charCodeAt(i);
            h1 = Math.imul(h1 ^ ch, 2654435761);
            h2 = Math.imul(h2 ^ ch, 1597334677);
        }
        h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
        h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
        return 4294967296 * (2097151 & h2) + (h1 >>> 0);
    },

    stat: function(path) {
        return fs.statSync(path);
    },

    ctimeMs: function(path) {
        return fs.statSync(path).ctimeMs;
    },

    mtimeMs: function(path) {
        return fs.statSync(path).mtimeMs;
    }
}