const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getAction } = require("../../services/waifuService");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pat")
    .setDescription("Pat someone")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Person to pat")
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const image = await getAction("pat");

    if (!image) {
      return interaction.editReply("❌ Could not fetch pat image.");
    }

    const embed = new EmbedBuilder()
      .setDescription(`${interaction.user} pats ${user} 🖐️`)
      .setImage(image)
      .setColor("Random");

    await interaction.editReply({ embeds: [embed] });
  }
};