FROM alpine:latest

RUN apk update && apk add htop nodejs npm chromium

WORKDIR /srv 

COPY ./src/server.js /srv
RUN echo "#!/bin/sh" >> /sbin/start
RUN echo "/usr/bin/node /srv/server.js &" >> /sbin/start
RUN echo "/usr/lib/chromium/chrome --no-sandbox --headless --disable-gpu --remote-debugging-port=9222" >> /sbin/start
#RUN echo "exit 1" >> /sbin/start
RUN chmod 777 /sbin/start
RUN /usr/bin/npm install chrome-remote-interface && /usr/bin/npm install http

CMD ["/sbin/start"]
