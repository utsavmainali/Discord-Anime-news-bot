const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const UserXP = require("../../models/UserXP");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show top XP users"),

  async execute(interaction) {
    const topUsers = await UserXP.find({})
      .sort({ xp: -1 })
      .limit(10);

    if (!topUsers.length) {
      return interaction.editReply("No data found yet.");
    }

    let description = "";

    for (let i = 0; i < topUsers.length; i++) {
      const user = topUsers[i];
      description += `**${i + 1}.** <@${user.userId}> - Level ${user.level} | XP ${user.xp}\n`;
    }

    const embed = new EmbedBuilder()
      .setTitle("🏆 XP Leaderboard")
      .setDescription(description)
      .setColor("Gold");

    await interaction.editReply({ embeds: [embed] });
  }
};