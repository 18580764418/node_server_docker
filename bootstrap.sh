#!/bin/bash

/etc/init.d/cron start
su - l -c "crontab /home/l/Service/myct"
pm2 start /home/l/Service/app.js
pm2-web &
/bin/bash