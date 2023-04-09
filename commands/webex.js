const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('webex')
        .setDescription("Ricerca un link ad un'aula Webex")
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Seleziona il tipo di ricerca')
                .setRequired(true)
                .setChoices(
                    {
                        name: 'Professore',
                        value: 'prof'
                    },
                    {
                        name: 'Corso',
                        value: 'course'
                    }
                )
        )
        .addStringOption(option =>
            option.setName('query')
                .setDescription('I termini di ricerca')
                .setRequired(true)
        ),
    async execute(interaction) {
        // Defer reply
        await interaction.deferReply();

        // Load Webex links file
        // readFileSync needs a path relative to the current working directory. Since this command is executed by
        // index.js, the current working directory is not commands and the path to the JSON file is ./src/webex.json
        // instead of ../src/webex.json
        const webex = JSON.parse(fs.readFileSync('./src/webex.json', 'utf8'));

        // Save common Webex link preamble
        // This will be prepended to the professor specific link later
        const webexLink = 'http://politecnicomilano.webex.com/meet/';

        // Initialize embed
        let queryResponseEmbed = new EmbedBuilder()
            .setTitle('Risultati di ricerca')
            .setDescription('Ecco cosa ho trovato!');

        // Save search query
        const query = interaction.options.getString('query');

        // Get type of search
        const type = interaction.options.getString('type');

        // Initialize found item counter
        let foundItems = 0;

        // Initialize regex to perform search
        const regex = new RegExp(query, "i");

        // Execute search query
        webex.forEach(item => {
            if(type === 'prof') {
                if(regex.test(item.prof)) {
                    queryResponseEmbed.addFields(
                        {
                            name: item.prof + ", " + item.subject,
                            value: webexLink + item.link
                        }
                    )
                    foundItems++;
                }
            } else if(type === 'course') {
                if(regex.test(item.subject)) {
                    queryResponseEmbed.addFields(
                        {
                            name: item.prof + ", " + item.subject,
                            value: webexLink + item.link
                        }
                    )
                    foundItems++;
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