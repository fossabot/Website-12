const Discord = require("discord.js");
const bots = require("../models/bots");
const profiles = require("../models/profile");

module.exports.run = async (client, message, args, reply) => {

  const userProfile = await profiles.findOne({ id: message.author.id });
  if (!userProfile || userProfile.admin !== true) return reply(`<:wrong:631497559424237600> Your aren't allowed to perform this action.`);
  var bot = message.mentions.users.first() || { id: args[0] };
  if (bot) bot = bot.id;
  if (!bot) return reply("<:wrong:631497559424237600> Please specify a bot to set a vanity URL for.");
  if (!args[1]) return  reply(`<:wrong:631497559424237600> Please specify a vanity URL.`)
  if (args[1].length > 30 ) return reply(`<:wrong:631497559424237600>The vanity URL can have a maximum of 30 characters.`)
  if (args[2]) return reply(`<:wrong:631497559424237600> The vanity URL should be one string (without spaces).`)
  await bots.findOne({ id: bot }, async (err, res) => {
    if (err) console.log(err);
    if (!res) return reply(`<:wrong:631497559424237600> The specified bot was not found.`);
    res.vanityUrl = args[1];
    await res.save().catch(e => console.log(e));
    reply(`<:check:631497559306666006> The vanity URL has been set to: \nhttps://botworld.ga/bot/${args[1]}`)
   
  });


};

module.exports.help = {
  name: "vanity"
};
