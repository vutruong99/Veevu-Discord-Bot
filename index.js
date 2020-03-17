const {Client, MessageAttachment} = require('discord.js')
const bot = new Client()

const fs = require('fs');

const https = require('https')
const token = "Njg5Mzc1MjQwMTMxNzA2OTQ0.XnB9cA.V5_eYBfIzBBERjvkM4I33iblqIM"

const generalCovidURL = "https://corona.lmao.ninja/all"
const countryCovidURL = "https://corona.lmao.ninja/countries/"
const PREFIX = 'vv'

let generalCovid = ''
let countryCovid = ''

let countryCodeRaw = fs.readFileSync("ISO3166-1.alpha2.json")
let countryCode = JSON.parse(countryCodeRaw)

function invert(json){
    var inverted = {}
    for(var key in json) {
      inverted[json[key].replace(/ /g, "_").replace(/\./g,"").replace(/\,/g,"").replace(/\-/g,"")] = key;
    }
    return inverted;
}


countryCode = invert(countryCode)
console.log(countryCode)

https.get(generalCovidURL, (resp) => {

  resp.on('data', (chunk) => {
    generalCovid += chunk;
  });

  resp.on('end', () => {
    console.log(JSON.parse(generalCovid))
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
      console.log(JSON.parse(countryCovid))
    });
  
  }).on("error", (err) => {
    console.log("Error: " + err.message);
});


bot.on('ready', ()=> {
    console.log("Veevu is vee-vued")
})


bot.on('message', msg=> {
    
    if (msg.content.startsWith(PREFIX)) {
        let args = msg.content.substring(PREFIX.length).split(" ")
        console.log(args)
        switch(args[1]) {
            case 'author': 
                msg.channel.send('thivuveevuuuuuuuuuuuuu whoosh')
                break
            case 'info':
                msg.channel.send('Version 1.0.0\nCreated on 17/3/2020')
                break
            case 'clear':
                if (!args[2]) msg.reply("Please specify how many messages to delete")
                msg.channel.bulkDelete(args[2])
                break
            case 'img':
                const attachment = new MessageAttachment('./test.jpg')
                msg.channel.send(attachment)
            case 'corona':
                if (args[2]) {
                    let i = 0
                    while( JSON.parse(countryCovid)[i].country != args[2].replace(/ /g, "_").replace(/\./g,"").replace(/\,/g,"").replace(/\-/g,"")) {
                        i++ 
                    }

                    let country = args[2].replace(/ /g, "_").replace(/\./g,"").replace(/\,/g,"").replace(/\-/g,"")
                    msg.channel.send(
                        ":flag_" + countryCode[country].toLowerCase() + ": Country: " + JSON.parse(countryCovid)[i].country +
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
    
})

bot.login(token)