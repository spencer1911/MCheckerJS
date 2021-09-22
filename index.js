const fs = require('fs');
const chalk = require('chalk');
const lineReader = require('line-reader');
const { stdin, stdout } = require('process');
const request = require('request');
const readline = require('readline');
const { yellowBright, red } = require('chalk');

const rl = readline.createInterface({'input':stdin, 'output': stdout})

var charArray='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
var xx=0;
var theLines;
var theLength;
var theSep="\r\n";
var allPwds="";
var allPwds2="";
var newPwd="";

rl.question(chalk.yellowBright('How many characters?\n> '), (characters) => {

    if(isNaN(characters)) {
        console.log(chalk.red('Error! This is not a number.'))

        rl.close()
    } else {
        theLength=characters;

        rl.question(chalk.yellowBright('How many lines?\n> '), (lines) => {

            if(isNaN(characters)) {
                console.log(chalk.red('Error! This is not a number.'))

                rl.close()
            } else {
                theLines=lines;

                while (xx < theLines) {

                    var x = 0;
                    while (x < theLength) {

                        newPwd = charArray.charAt(Math.floor(Math.random() * charArray.length));
                        allPwds += newPwd;
                        x++;
                    }
                    allPwds2 = allPwds2 + allPwds + theSep;
                    allPwds = "";
                    xx++;
                }

                rl.question(chalk.yellowBright('Do you want to check the usernames? (yes or no)\n> '), (checkOption) => {

                    if (checkOption === "yes") {
                        fs.writeFile('./usernames.txt', allPwds2, function(){})

                        lineReader.eachLine('./usernames.txt', function(line) {

                            request('https://api.mojang.com/users/profiles/minecraft/' + line, 
                            function (err, res, body) {
                                
                            if(String(body).includes(`"id"`) === true){
                                console.log(chalk.red(`${chalk.whiteBright(`[${chalk.redBright(' X ')}]`)} Username ${line} is already in use.`))
                            }

                            if(String(body) === ""){
                                console.log(chalk.green(`${chalk.whiteBright(`[${chalk.greenBright(' ✔ ')}]`)} Username ${line} is available.`))
                
                                fs.appendFile('./availables.txt', `${line}, \n`, function(){})
                            }

                            if (String(body).includes(`"TooManyRequestsException"`)) {
                                console.log(chalk.bgGrey(`Username ${line} was rate-limited.`))
                            }

                            if (String(body).includes(`"BadRequestException"`)) {
                                fs.appendFile('./invalids.txt', `${line}, <----- ${line.length} letters \n`, function(){})
                                    
                                console.log(chalk.gray(`${line} has more than 16 letters. (${line.length} letters)`))
                            }
                        })
                    })
                    rl.close()

                } else if(checkOption === "no") {
                    fs.writeFile('./usernames.txt', allPwds2, function(){})

                    console.log(yellowBright('Ok! Your nicknames have been stored in usernames.txt'))
                        
                    rl.close()
                } else {
                    console.log(red("Sorry! I don't recognize this option. Use yes or no."))
                        
                    rl.close()
                }
            })
        }
    })}
})
