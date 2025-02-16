require('dotenv/config');

const { Client, IntentsBitField } = require('discord.js');

const { Configuration, OpenAIApi } = require('openai');

const client = new Client ({
    intents : [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
})

client.on('ready',() => {
    console.log(' The bot is online !');
} );
// const configuration = new Configuration({
//     apiKey: process.env.API_KEY ,
// });
const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

client.on('messageCreate', async (message) =>{
 console.log(message);
 if (message.author.bot) return;
if ( message.channel.id !== process.env.CHANNEL_ID) return;
if (message.content.startsWith('!') )return;

let conversationlog = [{role: 'system',content:"You are a friendly chatbor." }];

conversationlog.push({
    role: 'user',
    content: message.content,
});

await message.channel.sendTyping();
const result = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo', // Specify the model
    messages: conversationlog,
});

message.reply(result.data.choice[0].message);
});

client.login(process.env.TOKEN);

