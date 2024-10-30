require('dotenv').config();
const { Bot } = require('grammy');

// Initialize the bot
const bot = new Bot(process.env.BOT_TOKEN);

// Simple start command to ensure the bot is working
bot.command('start', (ctx) => {
  ctx.reply("Hey! I'm here to notify you about your RPG adventures.");
});

bot.command('myid', (ctx) => {
    const userId = ctx.from.id;
    ctx.reply(`Your Telegram ID is: ${userId}`);
});

// Start the bot
bot.start();
