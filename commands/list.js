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
            });
        });

        const query = "SELECT R.Name, R.Link, A.FirstName, A.LastName, A.DiscordUsername FROM Resources R JOIN Author A ON R.AuthorID = A.ID";

        const results = await new Promise((resolve, reject) => {
            con.query(query, [], function(err, result) {
                if(err)
                    reject(err);
                else
                    resolve(result);
            });
        });

        if (results.length === 0) {
            await interaction.editReply("Che strano, non ci sono risorse...");
        } else {
            for(const row of results) {
                if (row.FirstName === null || row.LastName === null) {
                    listEmbed.addFields({
                        name: `${row.Name} by ${row.DiscordUsername}`,
                        value: row.Link
                    });
                } else {
                    listEmbed.addFields({
                        name: `${row.Name} by ${row.FirstName} ${row.LastName}`,
                        value: row.Link
                    });
                }
            }
            // Respond to user
            await interaction.editReply({ embeds: [listEmbed] });
        }

        // Finally, close the connection
        con.end();
    },
};