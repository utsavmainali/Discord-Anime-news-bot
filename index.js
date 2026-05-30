require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { setNewsChannel } = require("./cron/newsCron");
const mongoose = require("mongoose");
const UserXP = require("./models/UserXP");

const {
  Client,
  Collection,
  GatewayIntentBits,
  MessageFlags
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

client.on("messageCreate", async message => {
  if (message.author.bot) return;

  let user = await UserXP.findOne({ userId: message.author.id });

  if (!user) {
    user = new UserXP({ userId: message.author.id });
  }

  user.xp += 10;

  const nextLevel = user.level * 100;

  if (user.xp >= nextLevel) {
    user.level++;
    user.xp = 0;
    message.channel.send(
      `🎉 ${message.author} leveled up to **Level ${user.level}**!`
    );
  }

  await user.save();
});

client.commands = new Collection();

const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
  }
}

client.once("clientReady", (c) => {
  console.log(`✅ Logged in as ${c.user.tag}`);

  const channel = client.channels.cache.find(
    ch => ch.name === "anime-news"
  );

  if (channel) {
    setNewsChannel(channel);
    console.log("📰 News channel set!");
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  // ✅ Defer immediately to buy time for slow API calls
  try {
    await interaction.deferReply();
  } catch (err) {
    console.error("Failed to defer interaction:", err.message);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    try {
      // ✅ Use editReply since we already deferred, and use flags instead of ephemeral
      await interaction.editReply({
        content: "❌ Error executing command.",
        flags: MessageFlags.Ephemeral
      });
    } catch (err) {
      console.error("Failed to send error reply:", err.message);
    }
  }
});

// ✅ Prevent unhandled errors from crashing the bot
client.on("error", err => console.error("Discord client error:", err));

client.login(process.env.TOKEN);