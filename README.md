#  SDG Portal

## Prerequisited

* Docker
* docker-compose
* Nodejs (for development)

## Quick setup
In the root directory, run `docker-compose up`

### install dependencies
`npm install`

### serve with hot reload at localhost:8000
`GENERATOR_ENDPOINT=<your generator endpoint>/smartweb \ PROXY_ENDPOINT=<your proxy endpoint>/smartproxy \ npm run dev`

Example of dev devserver on localhost:8000 with local microservices
`GENERATOR_ENDPOINT=http://localhost:8080/smartweb PROXY_ENDPOINT=http://localhost:8082/smartproxy npm run dev`

Example of dev devserver on localhost:8000 with dev microservices
`GENERATOR_ENDPOINT=https://dev.dfil-tech.eu/smartweb PROXY_ENDPOINT=https://dev.dfil-tech.eu/smartproxy npm run dev`

### build for production with minification
`GENERATOR_ENDPOINT=<your generator endpoint>/smartweb \ PROXY_ENDPOINT=<your proxy endpoint>/smartproxy \ npm run build`

## Docker setup

### build docker image
`docker build \ --build-arg GENERATOR_ENDPOINT=<your generator endpoint>/smartweb \ --build-arg PROXY_ENDPOINT=<your proxy endpoint>/smartproxy \ -t smartvuefront . --no-cache`

### run docker image
`docker run -it -p 4000:80 smartvuefront`