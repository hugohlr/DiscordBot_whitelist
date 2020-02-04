const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const { exec } = require('child_process');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Connecté et prêt à être utilisé !');
	// set bot activity
	client.user.setPresence({
		game: {
			name: "!wl en MP pour valider votre @IP",
			type: 'PLAYING'
		},
		status: 'online'
	});
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.dmOnly && message.channel.type !== 'dm') {
		return message.reply('Vous n\'êtes pas autorisé à utiliser la commande ici, envoyez lui en DM !');
	}

	if (command.args && !args.length) {
		let reply = `Utilisation de la commande incorrecte, ${message.author}!`;

		if (command.usage) {
			reply += `\n${command.usage}`;
		}

		return message.channel.send(reply);
	}

	if (command.args && args[0].split('.').length != 4) {
		let reply = `Utilisation de la commande incorrecte, ${message.author}!`;

		if (command.usage) {
			reply += `\n${command.usage}`;
		}

		return message.channel.send(reply);
	}
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`Merci de patienter encore **\`${timeLeft.toFixed(1)} seconde(s)\`** avant de réutiliser la commande \`${command.name}\`.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);	