const fs = require('fs');
const chalk = require('chalk');
const lineReader = require('line-reader');
const {stdin,stdout} = require('process');
const request = require('request');
const readline = require('readline');
const {yellowBright,red,green} = require('chalk');
const settings = require('./settings.json')

const {eachLine} = require('line-reader');
const rl = readline.createInterface({'input': stdin,'output': stdout})

var charArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
var api = 'https://api.mojang.com/users/profiles/minecraft/';
var xx = 0;
var theLines;
var theLines2;
var theLength;
var theLength2;
var theSep = "\r\n";
var allPwds = "";
var allPwds2 = "";
var newPwd = "";
var logo =
`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
##     ##  ######  ##     ## ########  ######  ##    ## ######## ########  ${chalk.yellowBright('      ##  ######')} 
###   ### ##    ## ##     ## ##       ##    ## ##   ##  ##       ##     ## ${chalk.yellowBright('      ## ##    ## ')}
#### #### ##       ##     ## ##       ##       ##  ##   ##       ##     ## ${chalk.yellowBright('      ## ##       ')}
## ### ## ##       ######### ######   ##       #####    ######   ########  ${chalk.yellowBright('      ##  ######  ')}
##     ## ##       ##     ## ##       ##       ##  ##   ##       ##   ##   ${chalk.yellowBright('##    ##       ## ')}
##     ## ##    ## ##     ## ##       ##    ## ##   ##  ##       ##    ##  ${chalk.yellowBright('##    ## ##    ## ')}
##     ##  ######  ##     ## ########  ######  ##    ## ######## ##     ## ${chalk.yellowBright(' ######   ######   ')}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`

console.log(logo)

function mainStep() {
    rl.question(chalk.cyanBright('\n[1] Generate / Check\n[2] Settings\n[3] Close\n' + chalk.white('\\> ')), (mainQuestion) => {
        switch (mainQuestion) {
            case "1":
                theLines = settings.strAmount
                theLength = settings.strLength
                function aio() {
                    rl.question(chalk.yellow(`\n${chalk.yellowBright('Do you want to use the settings file?\n> ')}`), (useSettings) => {
                        switch(useSettings) {
                            case "yes":
                                theLines = settings.strAmount
                                theLength = settings.strLength
                                while (xx < theLines) {
                                var x = 0;
                                while (x < theLength) {
                                newPwd = charArray.charAt(Math.floor(Math.random() * charArray.length));
                                allPwds += newPwd;
                                x++
                                }
                                allPwds2 = allPwds2 + allPwds + theSep;
                                allPwds = "";
                                xx++
                                }

                                fs.writeFile('./usernames.txt', allPwds2, function(){})
                                lineReader.eachLine('./usernames.txt', function(line) {
                                    request(api + line, function (error, response, body) {  
                                        if(line.length <= 2 || line.length > 16) return console.log(chalk.redBright(`${line} is invalid.`));
                                        
                                        switch (true) {
                                            case String(body) === '':
                                                console.log(line + chalk.greenBright(' is available.'))
                                                fs.appendFile('./availables.txt', `${line}, \n`, function(){})
                                            break;
                                            
                                            case String(body).includes(`{"name":`):
                                                console.log(`${chalk.redBright(`${line} is unavailable.`)}`)
                                            break;
                                        }   
                                    })
                                    })
                                    rl.close()
                            break;
                            case "no":
                                function theQuestions() {
                                rl.question('how many characters?\n> ', (chars) => {
                                    theLength2 = chars;

                                    rl.question('how many lines?\n> ', (liness) => {
                                        theLines2 = liness;

                                        while (xx < theLines2) {
                                            var x = 0;
                                                while (x < theLength2) {
                                                    newPwd = charArray.charAt(Math.floor(Math.random() * charArray.length));
                                                    allPwds += newPwd;
                                                    x++
                                                }
                                            allPwds2 = allPwds2 + allPwds + theSep;
                                            allPwds = "";
                                            xx++
                                        }

                                        fs.writeFile('./usernames.txt', allPwds2, function(){})
                                        lineReader.eachLine('./usernames.txt', function(line) {
                                        request(api + line, function (error, response, body) {  
                                            if(line.length <= 2 || line.length > 16) return console.log(chalk.redBright(`${line} is invalid.`));
                                            
                                            switch (true) {
                                                case String(body) === '':
                                                    console.log(line + chalk.greenBright(' is available.'))
                                                    fs.appendFile('./availables.txt', `${line}, \n`, function(){})
                                                break;
                                                
                                                case String(body).includes(`{"name":`):
                                                    console.log(`${chalk.redBright(`${line} is unavailable.`)}`)
                                                break;
                                            }   
                                        })
                                        })
                                    })
                                })
                                }
                            rl.close()
                            break;
                        }
                    })
                }
                aio()
            break;
            case "2":
                function optionStep() {
                    rl.question(chalk.cyan(`\n   [1] View Settings File\n   [2] Change Settings\n   [3] Back\n   ${chalk.white('\\>')} `), (settingsOption) => {
                        switch(settingsOption) {
                            case "1":
                                console.log('\n' + chalk.gray(JSON.stringify(settings, null, 2)))
                                optionStep()
                            break;
                            case "2":
                                function changeSettingsStep() {
                                    rl.question(chalk.yellowBright('String Length: '), (stringLength) => {
                                    switch(true) {
                                        case (isNaN(stringLength)):
                                            console.log(red('This is not a number.'))
                                            changeSettingsStep()
                                        break;
                                        case (Number(stringLength) > Number(16)):
                                            console.log("This number is greater than 16.")
                                            changeSettingsStep()
                                        break;
                                        default:
                                            JSON.stringify(settings, null, 2)
                                            settings.strLength = stringLength;
                                            fs.writeFile('./settings.json', JSON.stringify(settings, null, 2), function(){})
                                        break;
                                        }

                                        rl.question(chalk.yellowBright('String Amount: '), (stringAmount) => {
                                        switch(true) {
                                            case (isNaN(stringAmount)):
                                            console.log(red('This is not a number.'))
                                            changeSettingsStep()
                                        break;
                                        case (Number(stringAmount) > Number(1000)):
                                            console.log("This number is greater than 1000.")
                                            changeSettingsStep()
                                        break;
                                        default:
                                            JSON.stringify(settings, null, 2)
                                            settings.strAmount = stringAmount;
                                            fs.writeFile('./settings.json', JSON.stringify(settings, null, 2), function(){})
                                            optionStep()
                                        break;
                                        }
                                        })
                                        
                                    })
                                }
                                changeSettingsStep()
                            break;
                            case "3":
                                mainStep()
                            break;
                            default:
                                console.log("I don't recognize this option.")
                                optionStep()
                            break;
                        }
                    })
                }
                optionStep()
            break;
            case "3":
                rl.close()
            break;
            default:
                console.log("\nI don't recognize this option\n")
                mainStep()
            break;
        }
    })
}
mainStep()


