// First of all, we get tmi.js, the Twitch API...
var twitch = require('tmi.js');
// Then, we get robotjs. This puts in our keyboard input to control the player.
var robot = require('robotjs');
// In order to read the config file, we need to get JSON5.
const json5 = require('json5');
require('json5/lib/register');
// Now, let's actually call for the file.
var config = require('./config.json5');
// We have the file now, let's simplify our lives now.
var botname = config.bot;
var oauth = config.oauth;
var streamer = config.username;
// var powers = config.powers; | These will be used later, but I
// var backed = config.backed; | haven't set powers up at the moment.
var chatbot = config.chatbot;
// We need the actual configurations to be used by the Twitch API. Let's go ahead and sort that out.
const twitchconfig = {
    identity: {
      username: botname,
      password: oauth
    },
    channels: [
      streamer
    ]
  };
// We NEED to set up our client that will be used by Twitch.
const client = new twitch.client(twitchconfig);
// And let the code begin!

// So, firstly we need to make sure that we can make certain things occur on certain events.
// In this case, we detect when the bot connects to Twitch, and when someone sends a message in chat.
client.on('connected', onConnectedHandler);
client.on('message', onMessageHandler);

// Let's set up being connected first!
function onConnectedHandler (addr, port) {
    console.log(`Username: ${botname}`);
    console.log(`Streamer: ${streamer}`);
    console.log(`* Connected to ${addr}:${port}`);
  }

// Let's set up the chat bot. Here we go!!!
function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // We don't want it to trigger itself, so let's make sure that it doesn't do that.
  
    // Now, we'll need to get rid of any whitespace in our messages.
    const commandName = msg.trim();
  
    // Let's set up our jump command.
    if (commandName.toLowerCase() === 'jump') { // This starts a new event, telling the bot that someone ran the command 'jump'!
      robot.keyTap("z"); // This is where robot.js comes in. We're going to press Z, the jump button, to jump.
      client.say(target, `/me ${context.username} made the character jump!`); // This tells the player they successfully jumped.
      console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); // This logs in the console that we executed the command!
    } else // This separates the jump command from other commands, and will be used frequently.
 // Now we'll make the attack command.
 if (commandName.toLowerCase() === 'attack') { 
  robot.keyTap("x"); 
  client.say(target, `/me ${context.username} made the character attack!`); 
  console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
} else
if (commandName.toLowerCase() === 'jumpattack') { 
  robot.keyTap("z"); 
  robot.keyTap("x"); 
  client.say(target, `/me ${context.username} made the character attack in mid-air!`); 
  console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
} else
if (commandName.toLowerCase() === 'right') { 
robot.keyTap("right"); 
client.say(target, `/me ${context.username} made the character move right!`); 
console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
} else
if (commandName.toLowerCase() === 'hardright') { 
  robot.keyTap("right"); 
  robot.keyTap("right");
  robot.keyTap("right");
  robot.keyTap("right");
  robot.keyTap("right");
  client.say(target, `/me ${context.username} made the character REALLY move right!!!`); 
  console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
} else
if (commandName.toLowerCase() === 'left') { 
  robot.keyTap("left"); 
  client.say(target, `/me ${context.username} made the character move left!`); 
  console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
} else
if (commandName.toLowerCase() === 'hardleft') { 
    robot.keyTap("left"); 
    robot.keyTap("left");
    robot.keyTap("left");
    robot.keyTap("left");
    robot.keyTap("left");
    client.say(target, `/me ${context.username} made the character REALLY move left!!!`); 
    console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
  } else 
  if (commandName.toLowerCase() === 'jumpleft') { 
    robot.keyTap("z");
    robot.keyTap("left"); 
    client.say(target, `/me ${context.username} made the character move left and jump!`); 
    console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
  } else
  if (commandName.toLowerCase() === 'jumphardleft') { 
      robot.keyTap("z");
      robot.keyTap("right"); 
      robot.keyTap("left");
      robot.keyTap("left");
      robot.keyTap("left");
      robot.keyTap("left");
      client.say(target, `/me ${context.username} made the character REALLY move left AND JUMP!!!`); 
      console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
    } else 
    if (commandName.toLowerCase() === 'jumpright') { 
      robot.keyTap("z");
      robot.keyTap("right"); 
      client.say(target, `/me ${context.username} made the character move right and jump!`); 
      console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
    } else
    if (commandName.toLowerCase() === 'jumphardright') { 
        robot.keyTap("z");
        robot.keyTap("right"); 
        robot.keyTap("right");
        robot.keyTap("right");
        robot.keyTap("right");
        robot.keyTap("right");
        client.say(target, `/me ${context.username} made the character REALLY move right AND JUMP!!!`); 
        console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
      } else 
  // Now let's focus on player 2!
  if (commandName.toLowerCase() === 'p2') { 
      robot.keyTap("f2"); 
      client.say(target, `/me ${context.username} made toggled player 2!`); 
      console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
    } else
    if (commandName.toLowerCase() === 'p2up') { 
        robot.keyTap("w");
        client.say(target, `/me ${context.username} made player 2 move up!`); 
        console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
      } else 
      if (commandName.toLowerCase() === 'p2hardup') { 
          robot.keyTap("w"); 
          robot.keyTap("w");
          robot.keyTap("w");
          robot.keyTap("w");
          robot.keyTap("w");
          client.say(target, `/me ${context.username} made player 2 REALLY move up!!!`); 
          console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
        } else
        if (commandName.toLowerCase() === 'p2left') { 
          robot.keyTap("d");
          client.say(target, `/me ${context.username} made player 2 move left!`); 
          console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
        } else 
        if (commandName.toLowerCase() === 'p2hardleft') { 
            robot.keyTap("d"); 
            robot.keyTap("d");
            robot.keyTap("d");
            robot.keyTap("d");
            robot.keyTap("d");
            client.say(target, `/me ${context.username} made player 2 REALLY move left!!!`); 
            console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
          } else
          if (commandName.toLowerCase() === 'p2down') { 
            robot.keyTap("s");
            client.say(target, `/me ${context.username} made player 2 move down!`); 
            console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
          } else 
          if (commandName.toLowerCase() === 'p2harddown') { 
              robot.keyTap("s"); 
              robot.keyTap("s");
              robot.keyTap("s");
              robot.keyTap("s");
              robot.keyTap("s");
              client.say(target, `/me ${context.username} made player 2 REALLY move down!!!`); 
              console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
            } else
            if (commandName.toLowerCase() === 'p2right') { 
              robot.keyTap("a");
              client.say(target, `/me ${context.username} made player 2 move right!`); 
              console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
            } else 
            if (commandName.toLowerCase() === 'p2hardright') { 
              robot.keyTap("a"); 
              robot.keyTap("a");
              robot.keyTap("a");
              robot.keyTap("a");
              robot.keyTap("a");
              client.say(target, `/me ${context.username} made player 2 REALLY move right!!!`); 
              console.log(`* ${context.username} executed the ` + commandName.toUpperCase() + ` command`); 
            } else
            if (commandName.toLowerCase() === 'everyone say hello! or: hi | hey | sup | yo | hola | hai | greetings | salutations | hallo | howdy | annyeong | aloha | konichiwa') {
              // The above line is the message that the Choice Chamber chat bot sends in the chat when on the main menu screen.
              if (context.username === chatbot) { // This checks to see if the Choice Chamber chat bot name, or anyone who is attempting to play as or impersonate one, matches the existing chat bot.
                robot.keyTap("z"); // By default it selects "play", so pressing Z will start the game again.
                console.log(`* New game`)
              } else { console.log(`* User ${context.username} attempted to send new game message`)}
          } else
            // now, for a command that does NOTHING in-game!!!
            if (commandName.toLowerCase() === '!cchelp') {
              client.say(target, `${context.username} Please visit https://jbmagination.com/TwitchPlaysCC`)
            } else { 
console.log(`* Unknown command sent by ` + context.username + `: ` + commandName.toUpperCase()); 
}
}

// Finally, we can connect to Twitch and let this bad boy run.
client.connect();

// And there you have it!
