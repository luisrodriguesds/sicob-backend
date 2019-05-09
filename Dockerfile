# FROM node:alpine

# WORKDIR /app

# COPY .env ./

# EXPOSE ${PORT}

# COPY package*.json ./

# RUN npm install

# RUN npm i -g @adonisjs/cli

# COPY . .

# CMD ["npm", "start"]

FROM node:10-alpine

WORKDIR /usr/src/app

RUN set -e \
    && apk update \
    && apk add --no-cache \
        wget \
        ca-certificates \
        sed \
    && npm i -g @adonisjs/cli \
    && rm -rf /var/cache/apk/*

EXPOSE 3333

COPY entrypoint.sh /usr/local/bin/

ENTRYPOINT [ "entrypoint.sh" ]

#docker build -t luis/adonisjs .
#docker run -p 3333:3333 luis/adonisjs