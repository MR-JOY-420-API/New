/**
 * includes/system/logger.js
 * Small colored logger used everywhere in the bot.
 */

const chalk = require("chalk");

function timestamp() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

module.exports = {
  info: (msg) => console.log(chalk.blue(`[${timestamp()}] [INFO]`), msg),
  success: (msg) => console.log(chalk.green(`[${timestamp()}] [OK]`), msg),
  warn: (msg) => console.log(chalk.yellow(`[${timestamp()}] [WARN]`), msg),
  error: (msg) => console.log(chalk.red(`[${timestamp()}] [ERROR]`), msg),
  command: (msg) => console.log(chalk.cyan(`[${timestamp()}] [CMD]`), msg),
  event: (msg) => console.log(chalk.magenta(`[${timestamp()}] [EVENT]`), msg),
};
