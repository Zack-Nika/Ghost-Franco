// Ghost Franco 🔱 - Backup Bot for Franco's Security
// Detects if main bot gets kicked, alerts the owner, and kicks the attacker

import { Client, GatewayIntentBits, Partials, Events } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
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

    let kicker = null;
    try {
      const auditLogs = await guild.fetchAuditLogs({ type: 20, limit: 1 }); // MEMBER_KICK
      const entry = auditLogs.entries.first();
      if (entry && entry.target.id === MAIN_FRANCO_ID) {
        kicker = entry.executor;

        // Try to kick the attacker
        const memberToKick = await guild.members.fetch(kicker.id).catch(() => null);
        if (memberToKick && memberToKick.kickable) {
          await memberToKick.kick('Kicked Franco's Security 🔱 bot');
        }
      }
    } catch (err) {
      console.error('Error fetching audit logs or kicking attacker:', err);
    }

    try {
      const dm = await owner.createDM();
      await dm.send(
        `🚨 **Franco's Security 🔱 has been kicked from your server!**\n\n` +
        `**Server:** ${guild.name}\n` +
        `**Time:** ${new Date().toLocaleString()}\n` +
        (kicker ? `**Attacker:** <@${kicker.id}> (${kicker.tag}) has been kicked.\n\n` : '') +
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
