const Discord = require("discord.js");
const profiles = require("../models/profile");

module.exports.run = async (client, message, args, reply) => {
  const userProfile = await profiles.findOne({ id: message.author.id });
  if (!userProfile || userProfile.mod !== true && userProfile.admin !== true) return reply(`<:wrong:631497559424237600> You aren't allowed to perform this action.`); 
const code = args.join(" ");
  function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }
          try {
          let ev = require('util').inspect(eval(code), { depth: 0 });
          let token = client.token.replace(/\./g, "\.")
          let re = new RegExp(token, 'g') 
          ev = ev.replace(re, "NO.FUCKING.TOKEN-f4DF5-4U-LOL-GET-GNOMED.54d4FFW.LOL").replace(client.config.dbUrl, "mongodb://this:was.supposed@to/?be.a.db.url.aint.it");
          const cleaned =  clean(ev)
          const MAX_CHARS = 3 + 2 + cleaned.length + 3;
          if (MAX_CHARS > 1500) {
            return message.channel.send("The output has exceeded 1500 charachters in length. Sending it as file...", { files: [{ attachment: Buffer.from(clean), name: "eval.txt" }] });
          }
          message.channel.send("**Input:**```js\n"+code+"```**Eval:**```js\n"+cleaned+"```")
          } catch(err) {
            if (err.length > 1950) {
              err = err.substr(0, 800);
          }
              message.channel.send('Error :```js\n'+err+"```")
          }

};

module.exports.help = {
  name: "eval"
};
