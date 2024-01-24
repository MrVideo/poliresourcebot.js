const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// Initialise SQLite driver
const sqlite = require('sqlite3');
const { dbName } = require('../config.json');

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

		try {
			const db = new sqlite.Database(dbName);

			// Initialize embed
			let queryResponseEmbed = new EmbedBuilder()
				.setTitle('Risultati di ricerca')
				.setDescription('Ecco cosa ho trovato!');

			// Save search query and format it
			const query = "%" + interaction.options.getString('query') + "%";
			const queryStatement = db.prepare('SELECT Name, URL, Username FROM Resources WHERE Name LIKE ?');

			const rows = await new Promise((resolve, reject) => {
				queryStatement.all([query], (err, rows) => {
					queryStatement.finalize();

					if (err)
						reject(err);
					else resolve(rows);
				});
			});

			if (rows.length !== 0) {
				rows.forEach((row) => {
					queryResponseEmbed.addFields({
						name: `${row.Name} by @${row.Username}`,
						value: row.URL
					})
				});
				
				await interaction.editReply({ embeds: [queryResponseEmbed] });
			} else {
				await interaction.editReply('Mi dispiace, non ho trovato risultati che corrispondano alla tua ricerca.');
			}

			db.close();
		} catch (err) {
			await interaction.followUp('Si è verificato un errore.');
			console.log('Error: ', err);
		}
    },
};
