require('dotenv').config();
const { Bot, InlineKeyboard } = require('grammy');

// Initialize the bot
const bot = new Bot(process.env.BOT_TOKEN);

// Simple start command to ensure the bot is working
bot.command('start', (ctx) => {
  // Extract referral code if present
  const messageText = ctx.message.text;
  const referralCode = messageText.split(' ')[1]; // Assuming command is "/start referral_code"

  // Store referral code in the session
  if (referralCode) {
    if (!ctx.session) {
      ctx.session = {};
    }
    ctx.session.referralCode = referralCode;
    console.log("Referral code set for user:", ctx.from.id, referralCode);
  }

  // Construct the URL to open your CRA in Telegram
  const baseUrl = 'https://187c-31-205-103-8.ngrok-free.app'; // Replace with your actual ngrok or public URL.
  const url = `${baseUrl}/?telegramId=${ctx.from.id}&referral=${referralCode}`;

  // Create an inline keyboard to open the adventure with a web_app button type
  const keyboard = new InlineKeyboard().webApp('Open Adventure', url);

  // Send a message with the referral code and the link to open the adventure
  ctx.reply(
    `Hey! I'm here to notify you about your RPG adventures. Your referral code is: ${referralCode}`,
    {
      reply_markup: keyboard,
    }
  );
});

// Start the bot
bot.start();
