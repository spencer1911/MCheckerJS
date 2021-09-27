const fs = require('fs');
const chalk = require('chalk');
const lineReader = require('line-reader');
const { stdin, stdout } = require('process');
const request = require('request');
const readline = require('readline');
const { yellowBright, red, green } = require('chalk');
const { eachLine } = require('line-reader');

const rl = readline.createInterface({'input':stdin, 'output': stdout})

var charArray='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
var api = 'https://api.mojang.com/users/profiles/minecraft/';
var xx=0;
var theLines;
var theLength;
var theSep="\r\n";
var allPwds="";
var allPwds2="";
var newPwd="";

rl.question(chalk.white(`[ ${chalk.yellow('1')} ] AiO (All-in-One)\n[ ${chalk.yellow('2')} ] Nickname Generator\n[ ${chalk.yellow('3')} ] Nickname Checker\n[ ${chalk.yellow('4')} ] Available Re-Checker\n> `), (question) => {
    switch (question) {
        case ('1'):
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
                                switch (checkOption) {
                                    case "yes":
                                        fs.writeFile('./usernames.txt', allPwds2, function(){})
                                        lineReader.eachLine('./usernames.txt', function(line) {
                                            request(api + line, function (error, response, body) {  
                                            switch (true) {
                                                case String(body) === '':
                                                    console.log(chalk.green(`${chalk.whiteBright(`[${chalk.greenBright(' ✔ ')}]`)} Username ${line} is available.`))
                                                    fs.appendFile('./availables.txt', `${line}, \n`, function(){})
                                                break;

                                                case String(body).includes('TooManyRequestsException'):
                                                    console.log(chalk.gray(String(body)))
                                                    console.log(line + ' got rate-limited')
                                                break;
                                                
                                                case String(body).includes(`{"name":`):
                                                    console.log(`${chalk.red(`${line} is unavailable.`)}`)
                                                break;
                                                
                                            }   
                                        })
                                        })
                                        rl.close()
                                    break;
                                    case "no":
                                        fs.writeFile('./usernames.txt', allPwds2, function(){})
            
                                        console.log(yellowBright('Ok! Your nicknames have been stored in usernames.txt'))
                                            
                                        rl.close()
                                    break;
                                    default:
                                        console.log(red("Sorry! I don't recognize this option. Use yes or no."))
                                    
                                        rl.close()
                                    break;
                                }
                        })
                    }
                })}
            })
        break;
        case ('2'): 
        var linesAmount;
        var strLength;

        rl.question(chalk.yellow('Strings Size:\n> '), (length2) => {
            strLength = length2;
            rl.question(chalk.yellow('Lines Amount:\n> '), (lines2) => {
                linesAmount = lines2;
                allStrs = "";
                newStr = "";
                allStrs2 = "";
                while (xx < linesAmount) {

                    var x = 0;
                    while (x < strLength) {
        
                        newStr = charArray.charAt(Math.floor(Math.random() * charArray.length));
                        allStrs += newStr;
                        x++;
                    }
                    allStrs2 = allStrs2 + allStrs + theSep;
                    allStrs = "";
                    xx++;
                }
                rl.question(chalk.yellow('Want to print the results?:\n> '), (yesOrNo) => {
                    switch (yesOrNo) {
                        case ('yes'):
                            console.log(allStrs2)
                            fs.writeFile('./usernames.txt', `${allStrs2}\n`, function(){})
                            console.log(chalk.yellowBright(`\n Your strings has been stored in usernames.txt.`))
                            rl.close()
                        break;
                        case ('no'):
                            fs.writeFile('./usernames.txt', `${allStrs2}\n`, function(){})
                            console.log(chalk.yellowBright(`\n Your strings has been stored in usernames.txt.`))
                            rl.close()
                        break;
                    }
                })
            })
        })  
        break;
        case '3':
            console.log('\n')
            eachLine('./usernames.txt', function(line) {
                request(api + line, function (that) {
                    switch (true) {
                        case String(body) === '':
                            console.log(chalk.green(`${chalk.whiteBright(`[${chalk.greenBright(' ✔ ')}]`)} Username ${line} is available.`))
                            fs.appendFile('./availables.txt', `${line}, \n`, function(){})
                        break;

                        case String(body).includes('TooManyRequestsException'):
                            console.log(chalk.gray(String(body)))
                            console.log(line + ' got rate-limited')
                        break;
                        
                        case String(body).includes(`{"name":`):
                            console.log(`${chalk.red(`${line} is unavailable.`)}`)
                        break;
                        
                    }

                if(line.length <= 2) console.log(chalk.redBright(`${line} is invalid.`));
                if(line.length > 16) console.log(chalk.redBright(`${line} is invalid.`));

                
            }) 
        })
        rl.close()
        break;
    case '4':
        console.log('\n')
        eachLine('./availables.txt', function(line) {
            request(api + line, 
            function (err, res, body) {
            if (String(body) === "") {
                console.log(green(`${line} still available!`))
                fs.appendFile('./stillAvailable.txt', `${line}\n`, function(){})
            } 
            if (String(body).includes(`"id"`) === true){
                console.log(red(`${line} is not available anymore`))
            } 
            if (String(body).includes(`TooMany`) === true) {
                console.log(chalk.yellow(`${line} got rate-limited. Forcing to close...`))
                rl.off()
            }
        }) 
        rl.close()
    })
    break;
    default:
        console.log(chalk.red(`I don't recognize this option, closing.`))
        rl.close()
}
})
