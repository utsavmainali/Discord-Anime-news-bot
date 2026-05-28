const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("anime")
    .setDescription("Search for an anime")
    .addStringOption(option =>
      option
        .setName("name")
        .setDescription("Anime name to search")
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString("name");

    try {
      const response = await axios.get(
        `https://api.jikan.moe/v4/anime?q=${query}&limit=1`
      );

      const anime = response.data.data[0];

      if (!anime) {
        return interaction.reply("❌ Anime not found.");
      }

      const embed = new EmbedBuilder()
        .setTitle(anime.title)
        .setURL(anime.url)
        .setDescription(
          anime.synopsis
            ? anime.synopsis.substring(0, 300) + "..."
            : "No description available."
        )
        .setImage(anime.images.jpg.image_url)
        .addFields(
          {
            name: "⭐ Score",
            value: anime.score ? anime.score.toString() : "N/A",
            inline: true
          },
          {
            name: "📺 Episodes",
            value: anime.episodes ? anime.episodes.toString() : "Unknown",
            inline: true
          },
          {
            name: "🎭 Status",
            value: anime.status || "Unknown",
            inline: true
          }
        )
        .setFooter({ text: "Data from MyAnimeList (via Jikan API)" })
        .setColor("Random");

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      interaction.reply("❌ Error fetching anime data.");
    }
  }
};