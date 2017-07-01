#!/usr/bin/bash

# TODO
 - Working on port 80
 - Finish full deploy script for server

sudo apt-get install nodejs
sudo apt-get install build-essential
sudo npm install -g pm2

# .bashrc - add 'export NODE_ENV="production"'
# Copy over git deploy keys - rename to .ssh/id_rsa
# Copy over mailer-api/config.js
# Copy over SSL Cert and chain
# git clone git@github.com:GDayDigitalNomads/mailer-api.git
cd mailer-api
sudo npm install -g
sudo nom link
pm2 start mailer

pm2 startup systemd
# Follow the prompts

sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 9100




