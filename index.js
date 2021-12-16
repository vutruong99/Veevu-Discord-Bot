const {Client, MessageAttachment} = require('discord.js')
const bot = new Client()
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs');
const https = require('https')

require('dotenv').config() 

const generalCovidURL = "https://corona.lmao.ninja/v2/all"
const countryCovidURL = "https://corona.lmao.ninja/v2/countries"
const PREFIX = 'vv'

/*Total cases, deaths and recovered cases*/
let generalCovid = ''

//Cases, deaths, recovered and more by countries
let countryCovid = ''

//ISO3166 alpha 2 country code
let countryCodeRaw = fs.readFileSync("ISO3166-1.alpha2.json")
let countryCode = JSON.parse(countryCodeRaw)

let randomTextJSON = fs.readFileSync("demguest.json")
let randomText = JSON.parse(randomTextJSON)
let textLen = randomText.messages.length


function invert(json){
    var inverted = {}
    for(var key in json) {
      inverted[json[key].replace(/ /g, "_").replace(/\./g,"").replace(/\,/g,"").replace(/\-/g,"")] = key;
    }
    return inverted;
}

//get general Conora data and country Corona
https.get(generalCovidURL, (resp) => {

  resp.on('data', (chunk) => {
    generalCovid += chunk;
  });

  resp.on('end', () => {

  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

/******************************************************************************* */
https.get(countryCovidURL, (resp) => {
    resp.on('data', (chunk) => {
      countryCovid += chunk;
    });
  
    resp.on('end', () => {

    });
  
  }).on("error", (err) => {
    console.log("Error: " + err.message);
});

function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}

//Random image, code form CodeLyon
function image(message){
 
    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + "food",
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }
    };
 
    request(options, function(error, response, responseBody) {
        if (error) {
            return;
        }
 
        $ = cheerio.load(responseBody);
 
        var links = $(".image a.link");
 
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
       
        console.log(urls);
 
        if (!urls.length) {
            return;
        }
        message.channel.send( urls[Math.floor(Math.random() * urls.length)]);
    });
 
 
}

//Print when ready
bot.on('ready', ()=> {
    console.log("Veevu is vee-vued")
    bot.user.setActivity("with your heart <3");
})

//Commands
bot.on('message', msg=> {
    
    if (msg.content.startsWith(PREFIX)) {
        let args = msg.content.substring(PREFIX.length).split(" ")
        console.log(args)
        switch(args[1]) {
            case 'help':
                msg.channel.send(`**prefix** = **vv**

Veevu Bot commands
---
**author** - Displays author's name
**info** - Displays bot's info
**clear <k>** - Deletes k messages
**rdn <k>** - Generates a random integer between 0 and k
**talk** - Talks
**corona <country code in ISO3166-1.alpha2>** - Displays Covid-19 status for the country
**cipher <text>** - Encodes text
                `)
                break
            case 'author': 
                msg.channel.send('thivuveevuuuuuuuuuuuuu whoosh')
                break
            case 'info':
                msg.channel.send('Version 2.0.0\nCreated on 17/3/2020')
                break
            case 'clear':
                if (!args[2]) msg.reply("Please specify how many messages to delete")
                msg.channel.bulkDelete(args[2])
                break
            case 'img':
                // if (args[2] == "author") {
                //     const attachment = new MessageAttachment('./eva.jpg')
                //     msg.channel.send(attachment)
                //     break
                // }  
                // const attachment = new MessageAttachment('./test.jpg')
                // msg.channel.send(attachment)
                image(msg)
                break
            case 'rdn':
                if (args[2]) {
                    if (isNormalInteger(args[2])) {
                        msg.channel.send(Math.floor(Math.random() * args[2]))
                    } else {
                        msg.channel.send("Not an integer")
                    }
                }
                break   
            case 'talk':
               
                let index = Math.floor(Math.random()*textLen)
                console.log(randomText.messages[index].author.isBot)
                while (randomText.messages[index].author.isBot == true) {
                    index = Math.floor(Math.random()*textLen)
                }
                   
                msg.channel.send(randomText.messages[index])
                break          
            case 'corona':
                if (args[2]) {

                    let i = 0
            
                    while( JSON.parse(countryCovid)[i].countryInfo.iso2 != args[2]) {
                        console.log(i)
                        if (i >= 220) break
                        
                        else i++ 
                    }

                    if (i == 220) break; 

                    msg.channel.send(
                        ":flag_" + args[2].toLowerCase() + ": Country: " + countryCode[args[2]] +
                        "\n:mask: Cases: " + JSON.parse(countryCovid)[i].cases +
                        "\n:sneezing_face: Today cases: " + JSON.parse(countryCovid)[i].todayCases +
                        "\n:skull_crossbones: Deaths " + JSON.parse(countryCovid)[i].deaths +
                        "\n:skull: Today deaths " + JSON.parse(countryCovid)[i].todayDeaths +
                        "\n:sweat_smile: Recovered " + JSON.parse(countryCovid)[i].recovered + 
                        "\n:fearful: Critical cases " + JSON.parse(countryCovid)[i].critical
                    )
                }

                else {
                    msg.channel.send(":mask: Cases: " + JSON.parse(generalCovid).cases + 
                    "\n:skull_crossbones: Deaths: " + JSON.parse(generalCovid).deaths + 
                    "\n:sweat_smile: Recovered: " + JSON.parse(generalCovid).recovered)
                }
                break 
            case 'cipher':
                if (args[2]) {
                    if (args[2]) {
                        let message = ""
                        for (let j = 2; j < args.length; j++) {
                            if (j != args.length -1) {
                                message = message + args[j] + " "
                            } else {
                                message = message + args[j]
                            }
                           
                        }
                      
                        let characters = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ "
                        let decrypted = ""
                        let randomShift = Math.floor(Math.random() * 26);
                        for (let i = 0; i < message.length; i++) {
                            decrypted = decrypted + characters[(randomShift + characters.indexOf(message[i])) % characters.length]
                        }

                        msg.channel.send(decrypted)
                    } else {
                        msg.channel.send("Enter some text to encrypt")
                    }
                }
                break;
            // case 'curse':
            //     msg.channel.send(chui[Math.floor(Math.random() * chuiLen)])
            //     break
            default:
                console.log("default case")
        }
    }


    if (msg.content.startsWith("Hello") || msg.content.startsWith("Chào")) {
        let greetings = ["Bonjour mon ami", "Hello my friend", "Wazzup wazzup", "Ni hao ma","Hola", "Ciao"]
        let random = Math.floor(Math.random() * greetings.length);
        msg.reply(greetings[random])
    } 

    if (msg.content.startsWith("Chào em")) {
        msg.reply("Anh đứng đây từ chiều")
    }

    const laughWhat = ["Cười cđg?", "ha ha ha ha", "Vui quá nhỉ?", "Sướng chưa?", "Hài thế", "lmao", "Hài hước", "Chmúa hề"]
    
    if (msg.content.startsWith("=)") || msg.content.startsWith(":)") || msg.content.startsWith("=]")) {
        msg.channel.send(laughWhat[Math.floor(Math.random() * 7)])
    }
    
})

bot.login(process.env.TOKEN)