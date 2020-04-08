# build stage
FROM node:lts-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

ARG GENERATOR_ENDPOINT
ENV GENERATOR_ENDPOINT $GENERATOR_ENDPOINT

ARG PROXY_ENDPOINT
ENV PROXY_ENDPOINT $PROXY_ENDPOINT

COPY . .

RUN \
GENERATOR_ENDPOINT=${GENERATOR_ENDPOINT} \
PROXY_ENDPOINT=${PROXY_ENDPOINT} \
npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]