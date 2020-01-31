@echo off
call pm2 stop index.js
call pm2 save --force