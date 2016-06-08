FROM node:6.0
EXPOSE 5000
ADD package.json /tmp/package.json
ADD AuthTokenServer.js /tmp/AuthTokenServer.js
ADD credentials.js /tmp/credentials.js
RUN cd /tmp && npm install
WORKDIR /tmp/
CMD ["node", "AuthTokenServer.js"]