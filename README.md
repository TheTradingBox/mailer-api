# Mailer API


A simple mailer api for static website forms. I created to enable secure newsletter and contact forms with my jekyll/github-pages website [G'Day Digital Nomads](https://www.gdaydigitalnomads.com).

Integrates with Google Recaptcha.
Works easily with Ubuntu Postfix or Google API as an SMTP Server.

#### Installation on Ubuntu 16.04

    $ sudo apt-get install nodejs
    $ sudo apt-get install build-essential
    $ sudo apt-get install nginx
    $ sudo npm install -g pm2
    $ sudo ufw allow 'Nginx HTTPS'
    $ pm2 startup systemd
    
    # Make sure Node Environment is "production"
    echo 'export NODE_ENV="production"' >> /home/ubuntu/.bashrc

#### Download code

    # Copy git deploy keys (or use https)
    $ sudo chmod 400 ~/.ssh/id_rsa
    $ git clone git@github.com:GDayDigitalNomads/mailer-api.git ~/mailer-api
    
    # Adjust config.example.js
    $ mv ~/mailer-api/config.example.js ~/mailer-api/config.js
          

#### Start Mailer API
    cd ~/mailer-api
    npm install
    pm2 start mailer-api

### Optional

##### Install Nginx
See: https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-16-04
 
There is an included nginx.conf file. 
 
    $ sudo mv nginx.conf /etc/nginx/available-sites/default
    $ sudo ufw status
    $ sudo ufw enable 'Nginx HTTPS'
    $ sudo systemctl restart Nginx

##### Install postfix
See: https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-postfix-on-ubuntu-16-04


##### Author

    Jordan Rancie


#### License

>The MIT License (MIT)
>
>Copyright (c) Jordan Rancie
>
>Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:
>
>The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
>
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
>  

