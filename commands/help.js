const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Restituisce un embed con i comandi disponibili.'),
	async execute(interaction) {
		// Embed declaration
		const helpEmbed = {
			title: 'Lista dei comandi',
			description: "Li puoi trovare digitando '/' e scorrendo nella lista che appare!",
			thumbnail: {
				url: 'https://i.ibb.co/hVXnBCs/helpicon.png'
			},
			fields: [
				{
					name: 'Aiuto',
					value: '`/help`'
				},
				{
					name: 'Ricerca risorse',
					value: '`/search <query>`'
				},
				{
					name: 'Aggiungi risorsa',
					value: '`/add <nome risorsa> <URL alla risorsa>`'
				},
				{
					name: 'Informazioni sul bot',
					value: '`/about`'
				},
			]
		}

		// Respond to user
		await interaction.reply({ embeds: [helpEmbed] });
	},
};
