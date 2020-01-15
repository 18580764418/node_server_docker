FROM echoly/node_server_base:0.0.1

WORkDIR /home/l/Service

COPY app.js /home/l/Service
COPY checkLogin.js /home/l/Service
COPY package-lock.json /home/l/Service
COPY package.json /home/l/Service
COPY routers /home/l/Service/routers
COPY schema /home/l/Service/schema
COPY public /home/l/Service/public
COPY bootstrap.sh /home/l/Service
COPY myct /home/l/Service

RUN chmod +x bootstrap.sh \
&& npm install

EXPOSE 8888

CMD './bootstrap.sh'
