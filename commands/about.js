const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Fornisce informazioni su questo bot.'),
    async execute(interaction) {
        // Embed declaration
        const aboutEmbed = {
            title: 'PoliResourceBot',
            description: 'Bot creato da Mario Merlo usando la libreria discord.js ~~e tanta documentazione~~',
            thumbnail: {
                url: 'https://i.ibb.co/BLTq2mH/icon.png'
            },
            fields: [
                {
                    name: 'Repository di GitHub',
                    value: '[Clicca qui](https://github.com/MrVideo/poliresourcebot.js)'
                },
                {
                    name: 'Documentazione Bot',
                    value: 'In arrivo'
                },
                {
                    name: 'Il mio sito',
                    value: '[Clicca qui](https://mariomerlo.me)'
                },
                {
                    name: 'Il mio canale',
                    value: '[YouTube](https://www.youtube.com/watch?v=0ASiDR5Yj0k)'
                }
            ]
        }

        // Respond to user
        await interaction.reply({ embeds: [aboutEmbed] });
    },
};
