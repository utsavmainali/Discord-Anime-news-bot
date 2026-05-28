const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const { fetchAnimeNews } = require("../services/newsService");

let newsChannel;

function setNewsChannel(channel) {
  newsChannel = channel;
}

// Runs every 1 hour
cron.schedule("0 * * * *", async () => {
  if (!newsChannel) return;

  const news = await fetchAnimeNews();

  if (!news.length) return;

  const latest = news[0];

  const embed = new EmbedBuilder()
    .setTitle("📰 Breaking Anime News")
    .setDescription(latest.content)
    .setURL(latest.link)
    .setColor("Red")
    .setTimestamp();

  newsChannel.send({ embeds: [embed] });
});

module.exports = { setNewsChannel };