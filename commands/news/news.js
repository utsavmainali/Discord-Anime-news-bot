const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { fetchAnimeNews } = require("../../services/newsService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("news")
    .setDescription("Get latest anime news"),

  async execute(interaction) {
    const news = await fetchAnimeNews();

    if (!news.length) {
      return interaction.editReply("❌ No news found.");
    }

    const embed = new EmbedBuilder()
      .setTitle("📰 Latest Anime News")
      .setColor("Blue")
      .setDescription(
        news
          .map(
            (n, i) =>
              `**${i + 1}. ${n.title}**\n${n.content}\n🔗 ${n.link}\n`
          )
          .join("\n")
      );

    await interaction.editReply({ embeds: [embed] });
  }
};