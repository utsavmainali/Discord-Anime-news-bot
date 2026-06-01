const {
  SlashCommandBuilder
} = require("discord.js");

const UserXP = require("../../models/UserXP");
const { generateRankCard } = require("../../utils/rankCard");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("View your rank card"),

  async execute(interaction) {
    const userData = await UserXP.findOne({
      userId: interaction.user.id
    });

    if (!userData) {
      return interaction.editReply({
        content: "❌ No XP found yet!"
      });
    }

    const image = await generateRankCard(
      interaction.user,
      userData.level,
      userData.xp
    );

    await interaction.editReply({
      files: [
        {
          attachment: image,
          name: "rank.png"
        }
      ]
    });
  }
};