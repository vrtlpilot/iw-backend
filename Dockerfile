FROM node

EXPOSE 3000
WORKDIR /app
COPY ./package*.json /app/
COPY ./wait-for-it.sh /app/
COPY . /app
RUN npm install \
    && npm install -g typescript \
    && tsc -p ./tsconfig.json 

CMD [ "node", "./build/server.js" ]
