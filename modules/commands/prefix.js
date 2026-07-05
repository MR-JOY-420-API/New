const fs = require("fs");
const path = require("path");

const CONFIG_PATH = path.join(__dirname, "..", "..", "JOY.json");

module.exports = {
  config: {
    name: "prefix",
    aliases: ["প্রিফিক্স"],
    description: "বট এর prefix পরিবর্তন করে (admin only)।",
    usage: "/prefix <new_prefix>",
    adminOnly: true,
  },

  run: async ({ api, event, args, config }) => {
    const newPrefix = args[0];
    if (!newPrefix) {
      return api.sendMessage(`বর্তমান prefix: ${config.prefix}`, event.threadID);
    }

    config.prefix = newPrefix;
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    api.sendMessage(`✅ Prefix পরিবর্তন করে "${newPrefix}" করা হলো।`, event.threadID);
  },
};
