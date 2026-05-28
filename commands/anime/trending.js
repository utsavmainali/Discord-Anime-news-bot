const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trending")
    .setDescription("Get trending anime"),

  async execute(interaction) {
    try {
      const response = await axios.get(
        "https://api.jikan.moe/v4/top/anime"
      );

      const anime = response.data.data[0];

      const embed = new EmbedBuilder()
        .setTitle(anime.title)
        .setDescription(anime.synopsis?.slice(0, 200))
        .setImage(anime.images.jpg.image_url)
        .addFields(
          {
            name: "⭐ Score",
            value: anime.score.toString(),
            inline: true
          },
          {
            name: "📺 Episodes",
            value: anime.episodes?.toString() || "Unknown",
            inline: true
          }
        );

      await interaction.reply({
        embeds: [embed]
      });
    } catch (error) {
      console.error(error);

      interaction.reply(
        "Failed to fetch trending anime."
      );
    }
  }
};