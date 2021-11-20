require("dotenv").config();

const express = require('express');
const {google} = require('googleapis');
const app = express();

const { Client, Intents, Message } = require('discord.js');
const { accessapproval } = require("googleapis/build/src/apis/accessapproval");

const myIntents = new Intents();//Intentions for the bot, basically what the boy can do 
myIntents.add(Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_TYPING)

const client = new Client({ intents: myIntents});

const PREFIX = "$"//the prefix for our commands

client.on('ready', () =>{
  console.log(`My dogs: ${client.user.tag} just logged in`);
  client.user.setActivity("In michaels bed");
  client.channels.cache.get('911696442173829142').send("Type ||%helpBro|| for list of Commands");//Copy client id in the channels.get if u want to send in a specific channel
})

var readNext = false;//Variable used to store action, if this is 1 then the next thing typed in the chat will be stored into a database or something
var currentUser;//Variable used to store the current person using the bot, so that noone else can interfere

client.on("messageCreate", msg =>{//Use the message create event instead of message
  console.log(`${msg.author.tag}`)
  if (msg.author.bot)return
  if(readNext === true && currentUser === msg.author.tag)
  {
    if (msg.content === 'new')
    {
        console.log('new')
        msg.reply('welcome')
    }
    else if(msg.content === 'existing')
    {
      console.reply('exisiting')
    }
    else{
      msg.reply('INVALID INPUT TRY AGAIN')
    }
  }
  else if(msg.content.startsWith(PREFIX) && readNext === false){
    console.log("command")
    const [CMD_NAME, ...args] = msg.content.trim().substring(PREFIX.length).split(/\s+/);
        
    if(CMD_NAME === "helpBro")
      {
        msg.channel.send("Possible Commands:\n$helpBro\n$bookings\n$stats")
      }
    else if(CMD_NAME === "bookings")
      {
        msg.channel.send("New or Existing USER?\nReply: new or existing [CASE SENSISTIVE]")          
        readNext = true;
        currentUser = msg.author.tag;
      }
    else if(CMD_NAME === "stats")
      {
        msg.channel.send("idk")       
     }
    else{
        msg.channel.send("I do not unerstand that command, do %helpBro for a list of available commands")
      }
      
      }
    }
)

app.get("/", async(req,res)=>{
 
  const auth = new google.auth.GoogleAuth({
    keyFile: "creds.json",
    scopes:"https://www.googleapies.com/auth/spreadsheets",
  });
  // Create client instance for auth
  const clientGoogle = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({version:"v4",auth:clientGoogle});

  const spreadsheetId = "1ov5HngPNvPEcaPeU4PF2Zp0j8zGjOFtqIZeGFhnVeyA";

  const metaData = await googleSheets.spreadsheets.get({
    auth,spreadsheetId
  })
  //Getting metaData of spreadsheet
  res.send(metaData)
})

app.listen(1337, (req,res) => console.log("running on 1337"));

client.login(process.env.DISCORD_BOT_TOKEN)//Discord bot logging in

