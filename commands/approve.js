const Discord = require("discord.js");
const bots = require("../models/bots");
const profiles = require("../models/profile");

module.exports.run = async (client, message, args, reply) => {
  const userProfile = await profiles.findOne({ id: message.author.id });
  if (!userProfile || userProfile.mod !== true && userProfile.admin !== true) return reply(`<:redTick:568885082321059865> You aren't allowed to perform this action`);

  var bot = message.mentions.users.first() || { id: args[0] };
  if (bot) bot = bot.id;
  if (!bot) return reply("<:wrong:631497559424237600> Please specify a bot to approve.");

  await bots.findOne({ id: bot }, async (err, res) => {
    if (err) console.log(err);
    if (!res) return reply(`<:wrong:631497559424237600> The specified bot was not found in the queue.`);
    res.approved = true;
    await res.save().catch(e => console.log(e));
    if (client.guilds.get("630460214235103253").members.get(res.mainOwner)) {
      client.guilds.get("630460214235103253").members.get(res.mainOwner).roles.add(client.guilds.get("630460214235103253").roles.find(r => r.name === "Developer"));
    }

    for (const owner of res.owners) {
      if (client.guilds.get("630460214235103253").members.get(owner)) client.guilds.get("630460214235103253").members.get(owner).roles.add(client.guilds.get("630460214235103253").roles.find(r => r.name === "Developer"));
    }

    var allOwners = res.owners;
    allOwners.unshift(res.mainOwner);
    allOwners = allOwners.map(u => `<@${u}>`);
    await client.channels.get("631142782995529730").send(`<@${res.id}> by ${allOwners.join(" ")} has been approved by <@${message.author.id}>.\n**URL**: https://botworld.ga/bot/${bot}`);
    await client.channels.get("631739811647979540").send(`<@${res.id}> by ${allOwners.join(" ")} has been approved by <@${message.author.id}>.\n**URL**: https://botworld.ga/bot/${bot}`);
    const user = client.users.get(res.mainOwner);
    if (user) user.send(`Your bot <@${bot}> was approved by ${message.author.tag}.`);
    client.emit("updatePresence");
    const Embed = new Discord.MessageEmbed()
    .setDescription(`Sucessfully approved <@${bot}>.\n[Click here to invite to the main server](${res.invite}&guild_id=630460214235103253)`)
    .setColor('GREEN');
    reply(Embed);
    const tokick = client.guilds.get("631711472082223124").members.get(bot.id);
    if (tokick) tokick.kick('approved');
  });
};

module.exports.help = {
  name: "approve"
};
