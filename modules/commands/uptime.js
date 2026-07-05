module.exports = {
  config: {
    name: "uptime",
    aliases: ["আপটাইম"],
    description: "বট কতক্ষণ ধরে চালু আছে দেখায়।",
    usage: "/uptime",
    adminOnly: false,
  },

  run: async ({ api, event }) => {
    const seconds = process.uptime();
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    api.sendMessage(`⏱️ Bot uptime: ${h}h ${m}m ${s}s`, event.threadID);
  },
};
