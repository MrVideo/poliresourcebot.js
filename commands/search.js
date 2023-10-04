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

        // Save search query
        const query = interaction.options.getString('query');

        // Initialize found item counter
        let foundItems = 0;

        // Initialize regex to perform search
        // The "i" flag makes the search case-insensitive.
        const regex = new RegExp(query, "i");

        // Execute search query
        resources.forEach(item => {
            if(regex.test(item.name)) {
                queryResponseEmbed.addFields(
                    {
                        name: item.name,
                        value: item.url
                    }
                );
                foundItems++;
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