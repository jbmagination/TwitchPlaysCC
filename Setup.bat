@echo off
cls
echo Twitch Plays Choice Chamber Setup
echo -----
echo Updating 'npm'...
echo/
call npm i -g npm
echo ------
echo Installing 'tmi.js'...
echo/
call npm install tmi.js
call npm install tmi.js --save
echo -----
echo Installing 'robotjs'...
echo/
call npm install robotjs
call npm install robotjs --save
echo -----
echo Installing 'json5'...
echo/  
call npm install json5
call npm install json5 --save
echo -----
echo Installing 'pm2'...
echo/   
call npm install -g pm2
call pm2 install pm2-windows-service
call pm2 install pm2-server-monit
call pm2 save --force
call pm2 set pm2:autodump true
move config-tmp.json5 config.json5
echo -----
echo Setup complete! Please restart your computer.
echo -----
echo/
pause
@echo on
