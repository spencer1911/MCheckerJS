/**
 * @author SynnK-FPS
 * @description Small version of old SCheckerRevamp/JS
 */

const fs = require('fs');
const readline = require('readline');
const request = require('request');
const chalk = require('chalk');
const { yellow } = require('chalk');

const rl = readline.createInterface({
    input: fs.createReadStream('usernames.txt'),
    output: process.stdout,
    terminal: false
});

rl.on('line', (line) => {
    request('https://api.mojang.com/users/profiles/minecraft/' + line, function(body) {

        if (line.length <= 2) {
            console.log(chalk.yellow("A line contains a username with 2 letters or less."))
            fs.appendFile('./invalid.txt', `${line.toString()}, <----- 2 Letters or less \n`, function(){})
        } else
        
        if (line.length >= 17) {
            console.log(chalk.yellow("A line contains a username with 17 letters or more."))
            fs.appendFile('./invalid.txt', `${line.toString()}, <----- More than 16 letters \n`, function(){})
        } else 

        if (line.includes(` `)) {
            console.log(chalk.yellow("A line contains a invalid symbol."))
            fs.appendFile('./invalid.txt', `${line.toString()}, <----- Invalid Symbol \n`, function(){})
        } else
        
        if (String(body).includes("TooManyRequestsException")) {
            console.log(yellow("Rate-limit"))
            fs.appendFile('./invalid.txt', `${line.toString()}, <----- Rate-limited \n`, function(){})
        } else

        if (String(body).includes("Requested")) {
            console.log(yellow("Invalid Symbol Request"))
            fs.appendFile('./invalid.txt', `${line.toString()}, <----- Invalid Symbol \n`, function(){})
        } else

        if (String(body).startsWith('{"name":')) {
            fs.appendFile('./unavailables.txt', `${line}, \n`, function(){})
            console.log(chalk.red(`Username ${line} is already in use.`))
        } else {
            fs.appendFile('./availables.txt', `${line}, \n`, function(){})
            console.log(chalk.green(`Username ${line} is available.`))
        }
    })
});
