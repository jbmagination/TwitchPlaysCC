@echo off
call pm2 start index.js --watch
call pm2 save --force
call pm2 monit