#!/usr/bin/bash

sudo apt-get install nodejs
sudo apt-get install build-essential
sudo apt-get install nginx
sudo npm install -g pm2
sudo ufw allow 'Nginx HTTPS'
echo 'export NODE_ENV="production"' >> /home/ubuntu/.bashrc

# Copy git deploy keys
sudo chmod 400 ~/.ssh/id_rsa
git clone git@github.com:GDayDigitalNomads/mailer-api.git
# locally run: npm run remote-setup
# This will copy your adapted config file & any ssl keys / certs

# Start Mailer API
cd mailer-api
npm install
pm2 start mailer-api


# Make sure PM2 is running at startup (follow the prompts)
pm2 startup systemd

# Set up nginx






