const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const connectToDiscord = async () => {
    try {
        await client.login(process.env.DISCORD_BOT_TOKEN);
        console.log('Connected to Discord');
    } catch (error) {
        console.error('Error connecting to Discord:', error);
    }
};

const fetchChannelMessages = async (channelId, limit = 5) => {
    try {
        const channel = await client.channels.fetch(channelId);
        if (!channel || !channel.isTextBased()) {
            throw new Error('Invalid or non-text channel');
        }

        const messages = await channel.messages.fetch({ limit });
        return messages.map((msg) => ({
            id: msg.id,
            content: msg.content,
            author: msg.author.username,
            createdAt: msg.createdAt,
        }));
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};

module.exports = { connectToDiscord, fetchChannelMessages };
