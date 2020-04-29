// TODO list:
// Detect repeats
//  
//
// First of all, we get tmi.js, the Twitch API...
const twitch = require("tmi.js");

// Then, we get robotjs. This puts in our keyboard input to control the player.
const robot = require("robotjs");

// We'll use an event handler later to set up a loop later.
var events = require('events');
// Let's make the eventEmitter variable to call in the future.
var eventEmitter = new events.EventEmitter();

// I have found NOT A SINGLE CHAT ROOM that has no misspellings for commands, so let's try to fix that.
// FYI, this words list is based off of sinderehorus' word-list GitHub repository. I added the extra commands.
var wordList = './words';
var autocorrectIt = require('autocorrect')({dictionary: wordList});
// In order to read the config file, we need to get JSON5.
require("json5/lib/register");
// Now, let's actually call for the file.
const config = require("./config.json5");
// Now that we have the config file, let's make our lives a little bit easier.
const botname = config.bot;
const oauth = config.oauth;
const streamer = config.username;
// var powers = config.powers;
// var backed = config.backed;
const chatbot = config.chatbot;
const controlp1 = config.controlp1;
const controlp2 = config.controlp2;

// Special things!
let p2bridged = false; // This detects if player 2 is currently bridged.
let pogoToggleTime = false; // This detects if someone has sent "pogoToggle" in chat.

let commands = {};
if (controlp1 && controlp2) { // Default keys for player 1 & player 2 mode
    commands = { // This maps each command.
        left: ["left", "character move left"],
        right: ["right", "character move right"],
        jump: ["z", "character jump"],
        pogotoggle: ["toggletime", "jumping toggle"],
        attack: ["x", "character attack"],

        p1left: ["left", "character move left"],
        p1right: ["right", "character move right"],
        p1jump: ["z", "character jump"],
        p1pogotoggle: ["toggletime", "jumping toggle"],
        p1attack: ["x", "character attack"],

        p2: ["f2", "toggled the gizmo"],
        p2left: ["a", "gizmo move left"],
        p2right: ["d", "gizmo move right"],
        p2up: ["w", "gizmo move up"],
        p2down: ["s", "gizmo move down"],
        p2jump: ["r", "gizmo toggle bridge-mode"],
        p2bridge: ["r", "gizmo toggle bridge-mode"],
        p2attack: ["t", "gizmo attack"]
    };
} else if (!controlp1 && controlp2) { // Player 1 disabled, Player 2 only mode
    commands = { // And we do it again...
        left: ["a", "gizmo move left"],
        right: ["d", "gizmo move right"],
        up: ["w", "gizmo move up"],
        down: ["s", "gizmo move down"],
        jump: ["r", "gizmo toggle bridge-mode"],
        bridge: ["r", "gizmo toggle bridge-mode"],
        attack: ["t", "gizmo attack"],
        
        p2left: ["a", "gizmo move left"],
        p2right: ["d", "gizmo move right"],
        p2up: ["w", "gizmo move up"],
        p2down: ["s", "gizmo move down"],
        p2jump: ["r", "gizmo toggle bridge-mode"],
        p2bridge: ["r", "gizmo toggle bridge-mode"],
        p2attack: ["t", "gizmo attack"]
    };
} else if (controlp1 && !controlp2) { // Player 2 disabled, Player 1 only mode
    commands = { // And then a shorter, much simpler one for player 2 only.
        left: ["left", "character move left"],
        right: ["right", "character move right"],
        jump: ["z", "character jump"],
        pogotoggle: ["toggletime", "jumping toggle"],
        attack: ["x", "character attack"],
        
        p1left: ["left", "character move left"],
        p1right: ["right", "character move right"],
        p1jump: ["z", "character jump"],
        p1pogotoggle: ["toggletime", "jumping toggle"],
        p1attack: ["x", "character attack"]
    };
}

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
//
// Just so you know, the below line is for ESLint:
// eslint-disable-next-line new-cap
const client = new twitch.client(twitchconfig);

// And with that, let the code begin!

// So, firstly we need to make sure that we can make certain things occur on certain events.
// In this case, we detect when the bot connects to Twitch, and when someone sends a message in chat.
client.on("connected", onConnectedHandler);
client.on("message", onMessageHandler);

// Let's set up being connected first!
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    client.say(streamer, "/me [TWITCH PLAYS] Bot is online!");
}

// Let's set up the chat bot.
function onMessageHandler(target, context, msg, self) {
    let commandsExecuted = 0; // This sets how many commands were executed this go around.
    let lastcmd = ""; // This sets up our current command so we can refer to it later.

    if (self) {
        return;
    } // We don't want it to trigger itself, so let's make sure that it doesn't do that.

    // Now, we'll need to get rid of any whitespace in our messages.
    const originalCommandName = msg.trim();
    // We want people to be able to run multiple commands and have it run them, so let's get that going...
    const originalCommandList = originalCommandName.split(/\s+/g);
    // We absolutely need to fix any misspellings.
    const commandName = autocorrectIt(originalCommandName);
    const commandList = commandName.split(/\s+/g);

    if (originalCommandName === "everyone say hello! or: hi | hey | sup | yo | hola | hai | greetings | salutations | hallo | howdy | annyeong | aloha | konichiwa") {
        if (context.username === chatbot) { // This checks to see if the Choice Chamber chat bot name, or anyone who is attempting to play as or impersonate one, matches the existing chat bot.
            robot.keyTap("z"); // By default it selects "play", so pressing Z will start the game again.
            console.log("* New game");
        } else {
            console.log(`* User ${context.username} attempted to send new game message but didn't match usernames with name ${chatbot}`);
        }
        return;
    } else if (originalCommandName === "!cchelp") {
        client.say(target, `[TWITCH PLAYS] ${context.username} Please visit https://jbmagination.com/TwitchPlaysCC`); // Sends a link to the website.
        return;
    }
    // Now let's set up our commands.

    let keepGoing = true; // This line lets the commands run.
    commandList.forEach(commandName => { // For each command,
        if (!keepGoing) { //                if the keepGoing command is set to false,
            return; //                      do nothing.
        }

        let actioned = true; // This tells sets a variable for use in the console, to log what commands were run.
        const originalCmd = commandName.toLowerCase(); // This is the original command set in lowercase.
        const cmd = autocorrectIt(originalCmd); // This auto-corrects the command.

        if (typeof commands[cmd] !== "undefined") { // If it's not defined anywhere in the code, it won't work.
            if (commands[cmd][0] === "r") { // R is the key on our keyboard that we are going to be pushing...
                robot.keyToggle("r", p2bridged ? "up" : "down"); // So we'll toggle it every time that command is run.
                p2bridged = !p2bridged; // This then toggles the state of p2bridged so that it can be toggled again when it's run next.
            } else
             if (commands[cmd][0] === "toggletime") { // A fake key, "toggletime", is for pogotoggle.
                robot.keyToggle("z", pogoToggleTime ? "up" : "down"); // Once again, we toggle the Z button.
                pogoToggleTime = !pogoToggleTime; // Then toggling the state.
            } else {
                robot.keyTap(commands[cmd][0]); // If it's none of the "commands" above, we'll simply tap the key.
            }
            lastcmd = commands[cmd]; // This sets the "lastcmd" variable to our current command.
            commandsExecuted++; // It also adds to the command counter to change the message depending on how many commands were run.
        } else {
            console.log(`* Unknown command sent by ${context.username}: ${commandName.toUpperCase()}`); // If there's no command, log that it didn't know the command.
            actioned = false; // Set "actioned" to false so nothing is logged.
            keepGoing = false; // Set keepGoing to false so nothing is done.
            return;
        }

        if (actioned) { //                                                                             If actioned is enabled,
            console.log(`* ${context.username} executed the ${commandName.toUpperCase()} command`); // say that a command was run.
        }
    });

    if (commandsExecuted === 1) { // This checks to see if we only executed one command.
        client.say(target, `/me  [TWITCH PLAYS] ${context.username} made the ${lastcmd[1]}!`);
    } else if (commandsExecuted > 1) { // If we haven't executed just one command, it will say how many commands we ran.
        client.say(target, `/me [TWITCH PLAYS] ${context.username} executed ${commandsExecuted} commands`);
    }
}

// Finally, we can connect to Twitch and let this bad boy run.
client.connect();
