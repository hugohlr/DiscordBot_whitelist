module.exports = {
	name: 'wl',
	description: 'Information about the arguments provided.',
	cooldown: 10800,
    args: true,
    usage: 'Votre @IP n\'a pas pu être ajoutée à notre whitelist car celle-ci ne respecte pas le format !\n\n**Utilisez https://mon-ip.io/ pour récuperer votre @IP.**',
    dmOnly: true,
	execute(message, args) {
		if (args[0] === 'foo') {
			return message.channel.send('bar');
        }
        const fs = require('fs');
        const now = Date.now();

        let date_ob = new Date(now);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        let hour = date_ob.getHours();
        let min = date_ob.getMinutes();
        let sec = date_ob.getSeconds();
        const date_log = "["+date + "-" + month + "-" + year +"] ["+hour+":"+min+":"+sec+"]";

        const AdresseIP = args[0];
        const LongAddrIP = AdresseIP.split('.');

        if (LongAddrIP.length === 4){
            var Log = date_log+" ==> Le joueur ["+message.author.tag+"] a validé l'@IP ==> "+AdresseIP+"\n";
            console.log("Le joueur ["+message.author.tag+"] a validé l'@IP ==> "+AdresseIP);

            fs.appendFile('log_whitelist.log', Log, function (err) {
                if (err) throw err;
                console.log('Log sauvegardée!');
            });

            const { spawn } = require('child_process');
            const cmd = "whitelist.bat "+AdresseIP
            console.log(cmd)
            
            const bat = spawn('cmd.exe', ['/c', cmd]);

            bat.on('exit', (code) => {
                if (code == 0){
                    console.log(`Adresse IP (${AdresseIP}) whitelistée avec succès.`);
                } 
            });
            //message.channel.send(`Argument: ${args[0]}`);
            message.channel.send(`Votre @IP =>${args[0]} a bien été ajoutée à notre whitelist !`);
        }
        else{
            message.channel.send(`Votre @IP =>${args[0]} n'a pas pu être ajoutée à notre whitelist car celle-ci ne respecte pas le format !\n**Utilisez https://mon-ip.io/ pour récuperer votre @IP.**`);        }
		
	},
};
