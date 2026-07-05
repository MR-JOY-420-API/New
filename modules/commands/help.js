module.exports = {
  config: {
    name: "help",
    aliases: ["হেল্প", "menu"],
    description: "সব command এর লিস্ট দেখায়।",
    usage: "/help",
    adminOnly: false,
  },

  run: async ({ api, event, commands, config }) => {
    const unique = new Set();
    for (const cmd of commands.values()) unique.add(cmd.config.name);

    let msg = `📜 ${config.botName} - Command List (${unique.size})\n`;
    msg += "─────────────────────\n";

    for (const name of [...unique].sort()) {
      const cmd = commands.get(name);
      msg += `• ${config.prefix}${cmd.config.name} — ${cmd.config.description || "কোনো description নেই"}\n`;
    }

    api.sendMessage(msg, event.threadID);
  },
};
