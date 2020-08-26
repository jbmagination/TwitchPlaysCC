### Notice
This is still going to be worked on as of now, however it will be discontinued very soon when a new mod I'm working on is released. Learn more soon!

# Twitch Plays Choice Chamber
This is a script to allow Twitch to play [Choice Chamber](https://choicechamber.com). Choice Chamber is a game where the Twitch chat can decide your fate, but this script allows it to control the player!

When finished and tested, the code will be released here.

At the moment this script only supports Windows but it will support macOS very soon.

*Want to see code for the website? Head [here](https://github.com/jbmagination/TwitchPlaysCC/tree/gh-pages).*

## Code Setup

### Setting up the script dependencies
1. Head to the [Python download page](https://www.python.org/downloads/) and download Python. Make sure Python is added to PATH.
2. Head to the [Visual Studio download page](https://visualstudio.microsoft.com) and download Community 2019.
2. Head to the [Node.js website](https://nodejs.org) and download a release. Latest is preferred.
3. Run the Setup file. It will install everything that is needed to run the script.
4. Restart your computer if desired.

### Configurating the script
1. Head to the [OAuth Password Generator](https://twitchapps.com/tmi/) and copy your OAuth key.
2. Open config.json.
3. Put in the OAuth Key under `oauth`.
4. By default, powers are disabled, however if you want chat to be able to give [subscriber](https://choicechamber.com/sub) or [Kickstarter](https://choicechamber.com/powers) powers, set it to `true` under `powers`.
5. If you enable powers, you will need to put in if you backed the Kickstarter. Most people haven't, so by default it's `false`, but if you did, set it to `true` under `backed`.
6. The most important parts! Enter your Twitch username under `streamer` and the username that will respond to bot commands under `bot`.
7. Save the file and exit.

### Starting TPCC
Not much to it really, open the Start script and watch it roll.

To stop it, open the Stop script. Pretty simple stuff.

## Planned features
- [x] Add auto-correct

- [ ] Detect repeats

- [ ] Detect Twitch game

- [ ] Actually adding powers

## Credits
Thanks to Yann Eves for helping with the auto-correct issues I was having. | [GitHub](https://github.com/yanneves), [Twitch](https://twitch.tv/yanneves_), [Website](https://yanneves.com)

Thanks to mdp for occasionally hopping in while giving suggestions and fixing code. | [GitHub](https://github.com/pupcus),  [Website](https://pupcus.github.io)

Thanks to Aaron (or Sojobo!) for being amazing and overhauling my code. You are the best! | [GitHub](https://github.com/Sojobo),  [Twitch](https://twitch.tv/Sojobo)

Thanks to Studio Bean for creating Choice Chamber. Insanely fun game, I will definitely get more games from you :) | [Website](https://onemrbean.com), [Game](https://choicechamber.com)

Thanks to Arttuzki for giving me the idea. | Unfortunately, they have no links. If you see them in a [Geometry Dash](https://www.twitch.tv/directory/game/Geometry%20Dash) Twitch chat, tell them I said hello :)

And lastly, thanks to you for being interested in my project.
