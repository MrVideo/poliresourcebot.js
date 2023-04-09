const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Restituisce un embed con i comandi disponibili.'),
    async execute(interaction) {
        // Embed declaration
        const helpEmbed = {
            title: 'Lista dei comandi',
            description: "Li puoi trovare digitando '/' e scorrendo nella lista che appare!",
            thumbnail: {
                url: 'https://i.ibb.co/hVXnBCs/helpicon.png'
            },
            fields: [
                {
                    name: 'Aiuto',
                    value: '`/help`'
                },
                {
                    name: 'Lista risorse',
                    value: '`/list`'
                },
                {
                    name: 'Ricerca risorse',
                    value: '`/search <query>`'
                },
                {
                    name: 'Informazioni sul bot',
                    value: '`/about`'
                },
                {
                    name: 'Cerca i link delle aule virtuali',
                    value: '`/webex [prof/subj] <query>`'
                }
            ]
        }

        // Respond to user
        await interaction.reply({ embeds: [helpEmbed] });
    },
};