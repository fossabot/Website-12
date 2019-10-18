const Discord = require("discord.js");
const profiles = require("../models/profile.js");

module.exports.run = async (client, message, args, reply) => {
  const userProfile = await profiles.findOne({ id: message.author.id });
  if (!userProfile || userProfile.mod !== true && userProfile.admin !== true) return reply(`<:wrong:631497559424237600> You aren't allowed to perform this action.`);

  const userBots = await require("../models/bots.js").find({ approved: false });
  var embed = new Discord.MessageEmbed()
    .setAuthor(`Unverified Bots:`, message.author.displayAvatarURL({ format: "png", size: 128 }))
    .setColor("BLUE");

  if (userBots.length < 1) {
    embed.setDescription(`There isn't any bot pending verification.`);
  } else {
    var bots = [];
    for (const bot of userBots) {
      bots.push({ name: bot.name, id: bot.id, prefix: bot.prefix, invite: bot.invite });
    }
    bots = bots.map(b => `[${b.name}](${b.invite}&guild_id=631711472082223124) (ID: ${b.id}) **Prefix:** \`${b.prefix}\``);
    embed.setDescription(`Bots pending verification:\n\n${bots.join(",\n")}\n=================\nShowing a total of ${userBots.length} bots.`);
  }
  reply(embed);
};

module.exports.help = {
  name: "queue"
};
