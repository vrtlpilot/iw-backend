FROM node

EXPOSE 3000
WORKDIR /app
COPY ./package*.json /app/
COPY ./wait-for-it.sh /app/
RUN npm install
COPY . /app
RUN npm install -g typescript \
    && tsc -p ./tsconfig.json 

CMD [ "node", "./build/server.js" ]
