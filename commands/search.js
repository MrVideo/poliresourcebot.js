const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

// Initialise MySQL driver
const mysql = require("mysql");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Ricerca una risorsa tra quelle disponibili.')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('I termini di ricerca')
                .setRequired(true)
        ),
    async execute(interaction) {
        // Defer reply
        await interaction.deferReply();

        // Initialise DB connection
        const con = mysql.createConnection({
            host: "host",
            user: "user",
            password: "password",
            database: "database"
        });

        try {
            // Connect to the database
            // The promise is used to make sure that the connection is successful before continuing with the query
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

            // Initialize embed
            let queryResponseEmbed = new EmbedBuilder()
                .setTitle('Risultati di ricerca')
                .setDescription('Ecco cosa ho trovato!');

            // Save search query and format it
            const query = "%" + interaction.options.getString('query') + "%";

            // Query the database for the resources matching this
            // A promise is used once again to make sure that the query executes before sending the result to the user
            const results = await new Promise((resolve, reject) => {
                con.query("SELECT R.Name, R.Link, A.FirstName, A.LastName, A.DiscordUsername FROM Resources R, Authors A WHERE R.Name LIKE ? AND R.AuthorID = A.ID;", [query], function (err, result, fields) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });

            // This variable makes sure not to send the embed if no results were found
            let done = false;

            if (results.length === 0) {
                // This is an error message that tells the user no item corresponds to their query
                await interaction.editReply("Mi dispiace, ma non ho trovato nulla che corrisponda ai tuoi criteri di ricerca.");
                done = true;
            } else {
                // If the query returned some items, build the embed with their name and link
                for (const row of results) {
                    if(row.FirstName === null || row.LastName === null) {
                        queryResponseEmbed.addFields({
                            name: `${row.Name} by ${row.DiscordUsername}`,
                            value: row.Link
                        });
                    } else {
                        queryResponseEmbed.addFields({
                            name: `${row.Name} by ${row.FirstName} ${row.LastName}`,
                            value: row.Link
                        });
                    }
                }
            }
        });

        // Return search result
        if(foundItems === 0)
            await interaction.editReply('Mi dispiace, ma non ho trovato nulla che corrisponda ai tuoi criteri di ricerca.');
        else {
            await interaction.editReply({ embeds: [queryResponseEmbed] });
        }
    },
};