# Dockerfile

# base image
FROM node:alpine

ARG port
ARG nextPubApi
ARG nextSsrApi
ARG nextServerMongoUrl
ARG nextServerDbName
ARG nextPriceMongoUrl
ARG nextPriceDbName
ARG identityUrl
ARG chain
ARG nodeEnv

ENV PORT=${port}
ENV NEXT_PUBLIC_API_END_POINT=${nextPubApi}
ENV NEXT_PUBLIC_SSR_API_END_POINT=${nextSsrApi}
ENV MONGO_SERVER_URL=${nextServerMongoUrl}
ENV MONGO_DB_SERVER_NAME=${nextServerDbName}
ENV MONGO_PRICE_URL=${nextPriceMongoUrl}
ENV MONGO_DB_PRICE_NAME=${nextPriceDbName}
ENV NEXT_PUBLIC_IDENTITY_SERVER_HOST=${identityUrl}
ENV NEXT_PUBLIC_CHAIN=${chain}
ENV NODE_ENV=${nodeEnv}

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# copy source files
COPY . /usr/src

# install dependencies
RUN yarn install
RUN yarn build

CMD yarn run start
