const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// Initialise MySQL driver
const mysql = require('mysql');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Elenca le risorse disponibili.'),

    async execute(interaction) {
        // Defer reply
        await interaction.deferReply();

        // Initialise connection
        const con = mysql.createConnection({
            host: "host",
            user: "user",
            password: "password",
            database: "database"
        });

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