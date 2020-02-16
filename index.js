// TODO list:
// Add auto-correct
// Detect repeats
// 
// First of all, we get tmi.js, the Twitch API...
const twitch = require("tmi.js");

// Then, we get robotjs. This puts in our keyboard input to control the player.
const robot = require("robotjs");

// In order to read the config file, we need to get JSON5.
require("json5/lib/register");

// Now, let's actually call for the file.
const config = require("./config.json5");
// We have the file now, let's simplify our lives now.
const botname = config.bot;
const oauth = config.oauth;
const streamer = config.username;
// var powers = config.powers;
// var backed = config.backed;
const chatbot = config.chatbot;

const controlp1 = config.controlp1;
const controlp2 = config.controlp2;
let p2bridged = false; // This detects if player 2 is currently bridged.
let pogoToggleTime = false; // This detects if someone has sent "pogoToggle" in chat.

let commands = {};
if (controlp1 && controlp2) { // Default keys for player 1 & player 2 mode
    commands = {
        left: ["left", "character move left"],
        right: ["right", "character move right"],
        jump: ["z", "character jump"],
        pogoToggle: ["toggletime", "toggled jumping"],
        attack: ["x", "character attack"],

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
    commands = {
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
    commands = {
        left: ["left", "character move left"],
        right: ["right", "character move right"],
        jump: ["z", "character jump"],
        pogoToggle: ["toggletime", "toggled jumping"],
        attack: ["x", "character attack"]
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
// And let the code begin!

// So, firstly we need to make sure that we can make certain things occur on certain events.
// In this case, we detect when the bot connects to Twitch, and when someone sends a message in chat.
client.on("connected", onConnectedHandler);
client.on("message", onMessageHandler);

// Let's set up being connected first!
function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    client.say(streamer, "/me [TWITCH PLAYS] Bot is online!");
}

// Let's set up the chat bot. Here we go!!!
function onMessageHandler(target, context, msg, self) {
    let commandsExecuted = 0; // This sets how many commands were executed this go around.
    let lastcmd = ""; // This sets up our current command so we can refer to it later.

    if (self) {
        return;
    } // We don't want it to trigger itself, so let's make sure that it doesn't do that.

    // Now, we'll need to get rid of any whitespace in our messages.
    const commandName = msg.trim();

    if (commandName === "everyone say hello! or: hi | hey | sup | yo | hola | hai | greetings | salutations | hallo | howdy | annyeong | aloha | konichiwa") {
        if (context.username === chatbot) { // This checks to see if the Choice Chamber chat bot name, or anyone who is attempting to play as or impersonate one, matches the existing chat bot.
            robot.keyTap("z"); // By default it selects "play", so pressing Z will start the game again.
            console.log("* New game");
        } else {
            console.log(`* User ${context.username} attempted to send new game message`);
        }
        return;
    } else if (commandName === "!cchelp") {
        client.say(target, `[TWITCH PLAYS] ${context.username} Please visit https://jbmagination.com/TwitchPlaysCC`); // Sends a link to the website.
        return;
    }

    // We want people to be able to run multiple commands and have it run them, so let's get that going...
    const commandList = commandName.split(/\s+/g);

    // Now let's set up our commands.
    
    // [TODO] Add additional comments
    let keepGoing = true;
    commandList.forEach(commandName => {
        if (!keepGoing) {
            return;
        }

        let actioned = true;
        const cmd = commandName.toLowerCase();

        if (typeof commands[cmd] !== "undefined") {
            if (commands[cmd][0] === "r") {
                robot.keyToggle("r", p2bridged ? "up" : "down");
                p2bridged = !p2bridged;
            } else
             if (commands[cmd][0] === "toggletime") {
                robot.keyToggle("z", pogoToggleTime ? "up" : "up");
                pogoToggleTime = !pogoToggleTime;
            } else {
                robot.keyTap(commands[cmd][0]);
            }
            lastcmd = commands[cmd];
            commandsExecuted++;
        } else {
            console.log(`* Unknown command sent by ${context.username}: ${commandName.toUpperCase()}`);
            actioned = false;
            keepGoing = false;
            return;
        }

        if (actioned) {
            console.log(`* ${context.username} executed the ${commandName.toUpperCase()} command`);
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
