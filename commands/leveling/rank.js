const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const UserXP = require("../../models/UserXP");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Check your XP and level"),

  async execute(interaction) {
    const user = await UserXP.findOne({
      userId: interaction.user.id
    });

    if (!user) {
      return interaction.reply("You have no XP yet. Start chatting!");
    }

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.username}'s Rank`)
      .addFields(
        { name: "Level", value: `${user.level}`, inline: true },
        { name: "XP", value: `${user.xp}`, inline: true }
      )
      .setColor("Random");

    await interaction.reply({ embeds: [embed] });
  }
};