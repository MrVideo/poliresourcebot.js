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

        await new Promise((resolve, reject) => {
            con.connect(function (err) {
                if (err) {
                    reject(err);
                } else {
                    console.log("Database connection successful");
                    resolve();
                }
            )
        })

        // Respond to user
        await interaction.reply({ embeds: [listEmbed] });
        },
};