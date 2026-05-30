const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getAction } = require("../../services/waifuService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("Hug someone")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Person to hug")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");

    const image = await getAction("hug");

    if (!image) {
      return interaction.reply("❌ Could not fetch hug image.");
    }

    const embed = new EmbedBuilder()
      .setDescription(`${interaction.user} hugged ${user} 🤗`)
      .setImage(image)
      .setColor("Random");

    await interaction.reply({ embeds: [embed] });
  }
};