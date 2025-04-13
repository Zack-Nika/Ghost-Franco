// Ghost Franco 🔱 - Backup Bot for Franco's Security
// Detects if main bot gets kicked, and alerts the owner

import { Client, GatewayIntentBits, Partials, Events } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers // Only required intent
  ],
  partials: [Partials.GuildMember]
});

// ✅ Main Franco's Security 🔱 BOT USER ID
const MAIN_FRANCO_ID = '1360760597238649034';

client.once(Events.ClientReady, () => {
  console.log(`Ghost Franco 🔱 is online as ${client.user.tag}`);
});

client.on(Events.GuildMemberRemove, async (member) => {
  if (member.user.id === MAIN_FRANCO_ID) {
    const guild = member.guild;
    const owner = await guild.fetchOwner().catch(() => null);
    if (!owner) return;

    try {
      const dm = await owner.createDM();
      await dm.send(
        `🚨 **Franco's Security 🔱 has been kicked from your server!**\n\n` +
        `**Server:** ${guild.name}\n` +
        `**Time:** ${new Date().toLocaleString()}\n\n` +
        `Do you want to bring Franco back?\n` +
        `Here is your reinvite link:`
      );

      // Reinvite link with correct client ID
      await dm.send(`https://discord.com/oauth2/authorize?client_id=${MAIN_FRANCO_ID}&permissions=8&scope=bot%20applications.commands`);

    } catch (err) {
      console.error('Ghost Franco failed to DM the server owner:', err);
    }
  }
});

client.login(process.env.TOKEN);
