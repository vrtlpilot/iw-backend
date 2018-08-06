FROM node

EXPOSE 3000
RUN mkdir -p /app
WORKDIR /app
COPY ./package*.json /app/
RUN npm install
COPY . /app
RUN npm install -g typescript \
    && tsc -p ./tsconfig.json 

CMD [ "npm", "start" ]
