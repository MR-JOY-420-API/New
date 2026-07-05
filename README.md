# JOY-MAIN — Messenger Bot

একটা সম্পূর্ণ Facebook Messenger bot ফ্রেমওয়ার্ক, command ও event আলাদা ফোল্ডারে সাজানো।

## 📁 Folder Structure

```
JOY-MAIN/
├── index.js                 # Launcher — এটা রান করবেন (auto-restart সহ)
├── JOY.js                    # আসল bot logic (login + handler wiring)
├── JOY.json                  # Config (prefix, admins ইত্যাদি)
├── JOYstate.json             # Facebook cookies/appstate (আপনাকে বসাতে হবে)
├── update.js                 # Version/changelog checker script
├── update.json                # Version তথ্য
├── package.json
├── modules/
│   ├── commands/              # প্রতিটা .js ফাইল = একটা command
│   │   ├── help.js
│   │   ├── ping.js
│   │   ├── uptime.js
│   │   └── prefix.js
│   └── events/                 # প্রতিটা .js ফাইল = একটা event listener
│       ├── welcomeEvent.js
│       └── leaveEvent.js
└── includes/
    ├── handler/
    │   ├── handleCommand.js    # incoming message → command dispatch
    │   └── handleEvent.js      # non-message events → event dispatch
    ├── controllers/
    │   └── loadModules.js      # commands/events dynamically load করে
    └── system/
        ├── login.js            # appstate দিয়ে login করে
        └── logger.js           # রঙিন console log
```

## 🚀 Setup

1. **Node.js install করুন** (v16+): https://nodejs.org
2. Terminal-এ JOY-MAIN ফোল্ডারে ঢুকে dependency install করুন:
   ```bash
   npm install
   ```
3. **Facebook Appstate (cookies) সংগ্রহ করুন:**
   - একটা browser extension ব্যবহার করুন (যেমন "c3c-fbstate" বা "EditThisCookie") অথবা কোনো appstate generator টুল দিয়ে আপনার Facebook account থেকে appstate বের করুন।
   - সেই পুরো JSON array কপি করে `JOYstate.json` ফাইলে পেস্ট করে সেভ করুন (পুরো ফাইলটা একটা `[...]` array হবে)।

   ⚠️ **সতর্কতা:** টেস্ট/সেকেন্ডারি অ্যাকাউন্ট ব্যবহার করাই ভালো। মেইন অ্যাকাউন্টে bot চালালে Facebook account lock/checkpoint হওয়ার ঝুঁকি থাকে। এটা Facebook-এর Terms of Service ভঙ্গ করতে পারে, তাই নিজ দায়িত্বে ব্যবহার করুন।

4. `JOY.json` ফাইলে আপনার admin Facebook ID এবং prefix বসান।
5. বট চালু করুন:
   ```bash
   node index.js
   ```
   (`index.js` bot crash করলে automatic restart করবে)

## ➕ নতুন Command যোগ করা

`modules/commands/` ফোল্ডারে একটা নতুন `.js` ফাইল বানান:

```js
module.exports = {
  config: {
    name: "hello",
    aliases: ["hi"],
    description: "একটা greeting পাঠায়",
    adminOnly: false,
  },
  run: async ({ api, event, args }) => {
    api.sendMessage("Hello! 👋", event.threadID);
  },
};
```

ব্যাস, বট restart করলেই command টা auto-load হয়ে যাবে — কোথাও manually require করার দরকার নেই।

## ➕ নতুন Event যোগ করা

`modules/events/` ফোল্ডারে একইভাবে নতুন `.js` ফাইল বানান, `config.type` এ কোন event শুনবে সেটা দিন (যেমন `"event"` mqtt log events এর জন্য)।

## 🔄 Version আপডেট রাখা

```bash
node update.js "আপনার changelog note এখানে"
```
এটা `package.json` আর `update.json` এর version sync রাখবে এবং changelog এ note যোগ করবে।

## ⚠️ গুরুত্বপূর্ণ নোট

- এই ফ্রেমওয়ার্কটা `ws3-fca` লাইব্রেরি ব্যবহার করে, যেটা Facebook এর official API না — এটা "unofficial" লাইব্রেরি, তাই যেকোনো সময় Facebook এর পরিবর্তনের কারণে ভেঙে যেতে পারে বা account restriction এর ঝুঁকি থাকতে পারে।
- বাণিজ্যিক বা বড় পরিসরে ব্যবহার করার আগে Facebook এর official **Messenger Platform API** (business/page-based, webhook দিয়ে) বিবেচনা করা উচিত — সেটা official ও নিরাপদ।
