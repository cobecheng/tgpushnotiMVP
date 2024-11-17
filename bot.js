require('dotenv').config();
const { Composer, Bot, InlineKeyboard, session } = require('grammy');

// Initialize the bot
const bot = new Bot(process.env.BOT_TOKEN);

// Define session middleware
bot.use(
  session({
    initial: () => ({ step: null }), // Session stores the user's current step
  })
);

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

  const baseUrl = 'https://dfb3-66-235-168-216.ngrok-free.app';
  const url = `${baseUrl}/?telegramId=${ctx.from.id}&referral=${referralCode}`;

  const keyboard = new InlineKeyboard().webApp('Open Adventure', url);

  ctx.reply(
    `Hey! I'm here to notify you about your RPG adventures. Your referral code is: ${referralCode}`,
    { reply_markup: keyboard }
  );
});


// /payment command to initiate purchase
bot.command("payment", async (ctx) => {
  ctx.session.step = "ask-stars"; // Update the session state
  await ctx.reply("How many stars would you like to buy? Please enter a number (e.g., 100).");
});

// Middleware to handle responses based on session step
bot.on("message:text", async (ctx) => {
  if (ctx.session.step === "ask-stars") {
    const input = parseInt(ctx.message.text, 10);

    // Validate the input
    if (isNaN(input) || input <= 0) {
      return ctx.reply("Invalid input. Please enter a valid number greater than 0.");
    }

    // Clear session state
    ctx.session.step = null;

    // Define parameters for the payment
    const title = `${input} Game Stars`;
    const description = "Use these stars to unlock new levels and features!";
    const payload = `purchase_stars_${input}`;
    const currency = "XTR";
    const amountPerStar = 1; // Cost of one star
    const prices = [{ label: `${input} Game Stars`, amount: input * amountPerStar }];

    try {
      // Send the invoice
      await ctx.api.sendInvoice(ctx.from.id, title, description, payload, currency, prices);
      console.log("Invoice sent to user:", ctx.from.id);
    } catch (error) {
      console.error("Error sending invoice:", error);
      await ctx.reply("An error occurred while processing the payment. Please try again.");
    }
  }
});




// Start the bot
bot.start();
