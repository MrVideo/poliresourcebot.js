const { SlashCommandBuilder } = require('discord.js');
// Initialise SQLite driver
const sqlite = require('sqlite3');
const { dbName } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Aggiungi una risorsa al database del bot')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Il nome della risorsa')
				.setRequired(true)
		)
		.addStringOption(option =>
			option.setName('link')
				.setDescription('Il link che porta alla risorsa')
				.setRequired(true)
		),

	async execute(interaction) {
		// Defer reply
		await interaction.deferReply();

		// Get data from the add command
		const resName = interaction.options.getString('name');
		const resLink = interaction.options.getString('link');
		const username = interaction.user.username;

		try {
			// Find (or create) SQLite database
			const db = new sqlite.Database(dbName);

			// Prepare the insert statement
			const insertStatement = db.prepare('INSERT OR REPLACE INTO Resources (Name, URL, Username) VALUES (?, ?, ?)');

			// Run the statement with the passed values and finalise
			insertStatement.run([resName, resLink, username]);
			insertStatement.finalize();

			// Close database and tell user everything went smoothly
			db.close();
			await interaction.editReply('Risorsa aggiunta correttamente!');
		} catch (err) {
			await interaction.followUp('Si è verificato un errore.');
			console.log('Error: ', err);
		}
	}
};
