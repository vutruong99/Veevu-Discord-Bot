const {Client, MessageAttachment} = require('discord.js')
const bot = new Client()
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs');
const https = require('https')

var token = require('./auth.json') 

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
})


//Commands
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

bot.login(token.token)