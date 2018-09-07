FROM node

EXPOSE 3000
WORKDIR /app
COPY ./package*.json /app/
COPY ./wait-for-it.sh /app/
COPY . /app
ARG NODE_URL
ENV NODE_URL=${NODE_URL}
RUN npm install \
    && npm install -g typescript \
    && tsc -p ./tsconfig.json 

CMD [ "node", "./build/server.js" ]
