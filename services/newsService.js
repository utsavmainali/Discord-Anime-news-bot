const Parser = require("rss-parser");
const parser = new Parser();

const feedURL = "https://www.animenewsnetwork.com/all/rss.xml";

async function fetchAnimeNews() {
  try {
    const feed = await parser.parseURL(feedURL);

    return feed.items.slice(0, 5).map(item => ({
      title: item.title,
      link: item.link,
      date: item.pubDate,
      content: item.contentSnippet
    }));

  } catch (error) {
    console.error("RSS Error:", error);
    return [];
  }
}

module.exports = { fetchAnimeNews };