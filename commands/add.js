const { SlashCommandBuilder } = require('discord.js');
// Initialise MySQL driver
const mysql = require("mysql");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Aggiungi una risorsa al database del bot')
        .addStringOption(option =>
            option.setName('resname')
                .setDescription('Il nome della risorsa')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Il link che porta alla risorsa')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('authuser')
                .setDescription('Username di Discord dell\'autore')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('authname')
                .setDescription('Nome e cognome dell\'autore della risorsa, separati da uno spazio')
        ),

    async execute(interaction) {
        // Defer reply
        await interaction.deferReply();

        // Get data from the add command
        const resName = interaction.options.getString('resname');
        const resLink = interaction.options.getString('link');
        const authName = interaction.options.getString('authname');
        const authUser = interaction.options.getString('authuser');

        // Split author name into first and last name
        let firstName, lastName;

        if(authName !== null) {
            const nameArray = authName.split(" ");
            firstName = nameArray[0];
            lastName = nameArray[1];
        }

        // Initialise DB connection
        const con = mysql.createConnection({
            host: "host",
            user: "user",
            password: "password",
            database: "database"
        });

        try {
            // Connect to the database
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

            // Start new transaction
            // This is needed to make sure that all insertions happen successfully before committing them
            await new Promise((resolve, reject) => {
                con.beginTransaction(function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });

            // Check whether the author is already in the database
            // If the author is in the database, their ID is saved for later
            const authorQuery = "SELECT * FROM Authors WHERE DiscordUsername = ?";
            let existingAuthor = -1;

            await new Promise((resolve, reject) => {
                con.query(authorQuery, [authUser], function (err, result) {
                    if (err) {
                        // Roll back the transaction if an error occurs
                        con.rollback(function () {
                            reject(err);
                        });
                    } else {
                        // If the author exists, set this variable to their ID
                        if(result.length === 1)
                            existingAuthor = result[0].ID;

                        resolve(result);
                    }
                });
            });

            // Add new author if the current author does not exist
            if(existingAuthor === -1) {
                if(authName === null) {
                    const addAuthorQuery = "INSERT INTO Authors (DiscordUsername) VALUES (?)";

                    await new Promise((resolve, reject) => {
                        con.query(addAuthorQuery, [authUser], function (err, result) {
                            if (err) {
                                // Roll back the transaction if an error occurs
                                con.rollback(function () {
                                    reject(err);
                                });
                            } else {
                                // Save ID of inserted author for later
                                existingAuthor = result.insertId;
                                resolve(result);
                            }
                        });
                    });
                } else {
                    const addAuthorQuery = "INSERT INTO Authors (FirstName, LastName, DiscordUsername) VALUES (?, ?, ?)";

                    await new Promise((resolve, reject) => {
                        con.query(addAuthorQuery, [firstName, lastName, authUser], function (err, result) {
                            if (err) {
                                // Roll back the transaction if an error occurs
                                con.rollback(function () {
                                    reject(err);
                                });
                            } else {
                                // Save ID of inserted author for later
                                existingAuthor = result.insertId;
                                resolve(result);
                            }
                        });
                    });
                }
            }

            // Perform the insertion query for the Resources table
            const resInsertQuery = "INSERT INTO Resources (Name, Link, AuthorID) VALUES (?, ?, ?)";
            let insertedResId;

            await new Promise((resolve, reject) => {
                con.query(resInsertQuery, [resName, resLink, existingAuthor], function (err, result) {
                    if (err) {
                        // Roll back the transaction if an error occurs
                        con.rollback(function () {
                            reject(err);
                        });
                    } else {
                        // Save ID of inserted resource for later
                        insertedResId = result.insertId;
                        resolve(result);
                    }
                });
            });

            // At this point, all operations have completed, so the transaction can end
            await new Promise((resolve, reject) => {
                con.commit(function (err) {
                    if (err) {
                        // Roll back the transaction in case of commit error
                        con.rollback(function () {
                            reject(err);
                        });
                    } else {
                        resolve();
                    }
                });
            });

        } catch {
            console.error('Error:', err);
            await interaction.followUp('Si è verificato un errore durante l\'inserimento.');
        } finally {
            // Close the database connection
            con.end();
            await interaction.editReply('Risorsa aggiunta!')
        }
    }
};