module.exports = {
  config: {
    name: "ping",
    aliases: ["পিং"],
    description: "বট এর response speed চেক করে।",
    usage: "/ping",
    adminOnly: false,
  },

  run: async ({ api, event }) => {
    const start = Date.now();
    const sent = await api.sendMessage("🏓 Pinging...", event.threadID);
    const latency = Date.now() - start;
    api.editMessage
      ? api.editMessage(`🏓 Pong! ${latency}ms`, sent.messageID)
      : api.sendMessage(`🏓 Pong! ${latency}ms`, event.threadID);
  },
};
