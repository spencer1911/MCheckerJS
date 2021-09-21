const fs = require('fs');
const readline = require('readline');
const request = require('request');
const chalk = require('chalk');

const rl = readline.createInterface({
    input: fs.createReadStream('./usernames.txt'),
    output: process.stdout,
    terminal: false,
    readable: true
});
 
rl.on('line', (line) => {
    request('https://api.mojang.com/users/profiles/minecraft/' + line, function (err, res, body) {
        if (String(body) == "") {
            if (line.length <= 2) {
                fs.appendFile('./invalids.txt', `${line}, <----- 2 or less letters. \n`, function(){})
                console.log(chalk.magentaBright(`${line} is invalid.`))
            } else {
                fs.appendFile('./availables.txt', `${line}, \n`, function(){})
                console.log(chalk.greenBright(`${line} is available.`))
            } 
        }

        if (String(body).includes(`"TooManyRequestsException"`)) {
            console.log(chalk.bgGrey(`Username ${line} was rate-limited.`))
        }

        if (String(body).includes(`"id"`) == true) {
            console.log(chalk.red(`${line} is already in use.`))
        }

        if (String(body).includes(`"BadRequestException"`)) {
            fs.appendFile('./invalids.txt', `${line}, <----- ${line.length} letters \n`, function(){})
            console.log(chalk.gray(`${line} has more than 16 letters. (${line.length} letters)`))
        }
    });
})
