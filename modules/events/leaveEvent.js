module.exports = {
  config: {
    name: "leaveEvent",
    type: "event", // fires on log:unsubscribe (member removed/left)
  },

  run: async ({ api, event, config }) => {
    if (!config.leaveEventEnabled) return;
    if (event.logMessageType !== "log:unsubscribe") return;

    const leftID = event.logMessageData.leftParticipantFbId;
    if (leftID === api.getCurrentUserID()) return;

    api.sendMessage("👋 একজন মেম্বার গ্রুপ থেকে চলে গেলেন।", event.threadID);
  },
};
