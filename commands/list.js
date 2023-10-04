const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Elenca le risorse disponibili.'),
    async execute(interaction) {
        // Embed initialization
        let listEmbed = new EmbedBuilder().setTitle('Lista delle risorse');

        // Add items to embed
        resources.forEach(item => {
            listEmbed.addFields(
                {
                    name: item.name,
                    value: item.url
                }
            )
        })

        // Respond to user
        await interaction.reply({ embeds: [listEmbed] });
        },
};