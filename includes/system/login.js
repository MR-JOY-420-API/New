/**
 * includes/system/login.js
 * Handles logging into Facebook Messenger using the appstate/cookies
 * stored in JOYstate.json.
 */

const fs = require("fs");
const path = require("path");
const login = require("ws3-fca");
const logger = require("./logger");

const STATE_PATH = path.join(__dirname, "..", "..", "JOYstate.json");

function loginWithState() {
  return new Promise((resolve, reject) => {
    let appState;

    try {
      appState = JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
    } catch (err) {
      return reject(
        new Error(
          "JOYstate.json পড়া যায়নি। এখানে আপনার Facebook appstate/cookies (JSON array) পেস্ট করুন।"
        )
      );
    }

    if (!Array.isArray(appState) || appState.length === 0) {
      return reject(
        new Error(
          "JOYstate.json খালি আছে। বট চালানোর আগে এখানে valid appstate cookies বসাতে হবে।"
        )
      );
    }

    login({ appState }, (err, api) => {
      if (err) {
        logger.error("Login failed. Appstate/cookies expired হতে পারে.");
        return reject(err);
      }

      // Keep the appstate refreshed on disk so sessions stay valid longer
      try {
        fs.writeFileSync(STATE_PATH, JSON.stringify(api.getAppState(), null, 2));
      } catch (e) {
        logger.warn("JOYstate.json রিফ্রেশ করা যায়নি: " + e.message);
      }

      api.setOptions({
        listenEvents: true,
        selfListen: false,
        updatePresence: false,
      });

      resolve(api);
    });
  });
}

module.exports = { loginWithState };
