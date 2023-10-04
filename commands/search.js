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

        // Load resources
        // readFileSync needs a path relative to the current working directory. Since this command is executed by
        // index.js, the current working directory is not commands and the path to the JSON file is ./src/resources.json
        // instead of ../src/resources.json
        const resources = JSON.parse(fs.readFileSync('./src/resources.json', 'utf8'));

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