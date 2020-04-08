#  SmartToolbox Frontend

## Table of Contents
[[_TOC_]]

## Introduction
This frontend interfaces to the SmartContractGenerator and SmartContractProxy microservices. The general idea is to have a webapp that simplifies the user experience of these components.
The user who will use this frontend will have views of tables and specific details of each template and contract present on the system. With a graphical environment it is also easier to perform operations such as creating, modifying, deleting, seeing data in the system.
This frontend also provides some procedures for the step-by-step creation of templates. In particular, these procedures are:
- Full template creation: in this flow, the user will be asked to provide solidity, jsonschema and html
- Technical template creation: in this flow, it will be possible to create a template skeleton, composed of solidity and jsonschema
- HTML template creation: in this flow, the user will choose a template skeleton, composed of solidity and jsonschema, and the user will have to write his own html, and set the type of variables or if necessary insert default values, in order to customize the template according to your needs.
![](https://i.imgur.com/JnTRbkc.png)

For more details on the functioning of the microservices, please refer to the documentation of the SmartContractGenerator and the SmartContractProxy.

## Webapp configuration 
The webapp is implemented with the Vuejs framework. It consists of a dashboard with a menu on the left and the contents in the central section. Authentication occurs via OAuth2.0 using the [oidc-client](https://github.com/IdentityModel/oidc-client-js)
library, the configurations are present in the `/src/services/AuthService.js` file. It is necessary to specify in the following parameters:
- AUTH0_DOMAIN
- client_id
- redirect_uri
- post_logout_redirect_uri

These parameters refer to the AAC access control, present in the architecture.

As you can read in the SmartContractGenerator documentation, a template is intended to be enhanced, generating a contract.
In order to enhance a template, a library is present in the `static/plugins/smtb.js` location.
This library must be configured by inserting the endpoint on which the SmartContractGenerator is running. This library allows you to get a template and print its html on the screen. This html has some inputs, in which its valued, if inserted, will replace the variables present in the template and generate a contract. With the "send contract" button present in the bottom a template html, a contract is sent to the SmartContractGenerator and then it will be viewable in the list of contracts.
Once a contract is present in the list of contracts, it is possible to deploy it in one of the blockchains registered in the SmartContractProxy. Once the contract is deployed, you can interact with its methods using the proxy APIs.

## Prerequisited

* Docker
* docker-compose
* Nodejs (for development)

## Quick setup
In the root directory, run `docker-compose up`

## Setup for development
The development environment used was VS Code.

### install dependencies
`npm install`

### serve with hot reload at localhost:8000
`GENERATOR_ENDPOINT=<your generator endpoint>/smartweb \ PROXY_ENDPOINT=<your proxy endpoint>/smartproxy \ npm run dev`

Example:
`GENERATOR_ENDPOINT=http://localhost:8080/smartweb PROXY_ENDPOINT=http://localhost:8082/smartproxy npm run dev`

`GENERATOR_ENDPOINT=https://dev.dfil-tech.eu/smartweb PROXY_ENDPOINT=https://dev.dfil-tech.eu/smartproxy npm run dev`

### build for production with minification
`GENERATOR_ENDPOINT=<your generator endpoint>/smartweb \ PROXY_ENDPOINT=<your proxy endpoint>/smartproxy \ npm run build`

## Docker setup

### build docker image
`docker build \ --build-arg GENERATOR_ENDPOINT=<your generator endpoint>/smartweb \ --build-arg PROXY_ENDPOINT=<your proxy endpoint>/smartproxy \ -t smartvuefront . --no-cache`

### run docker image
`docker run -it -p 4000:80 smartvuefront`