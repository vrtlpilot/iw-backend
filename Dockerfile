FROM node

EXPOSE 3000
WORKDIR /app
COPY ./package*.json /app/
COPY ./wait-for-it.sh /app/
COPY . /app
ARG PORT
ARG DB_URI
RUN npm install \
    && npm install -g typescript \
    && tsc -p ./tsconfig.json 

CMD [ "NODE_URL=http://icoworld.projects.oktend.com:8545", "node", "./build/server.js" ]
