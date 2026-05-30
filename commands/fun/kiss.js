const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getAction } = require("../../services/waifuService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kiss")
    .setDescription("Kiss someone")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Person to kiss")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const image = await getAction("kiss");

    if (!image) {
      return interaction.editReply("❌ Could not fetch kiss image.");
    }

    const embed = new EmbedBuilder()
      .setDescription(`${interaction.user} kissed ${user} 💋`)
      .setImage(image)
      .setColor("Random");

    await interaction.editReply({ embeds: [embed] });
  }
};