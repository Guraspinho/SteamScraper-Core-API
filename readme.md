# SteamScraper Core-API
This is a core user registration and authentication api for a project called SteamScraper.

## Author:
Irakli Guraspashvili

## Stack:
- Server - Node.js, Express.js.
- Database - MongoDB.
- Frontend - Angular. 
- API Gateway - Kong.
- Deployment - Docker.

## Architecture:
- Micro services.
- REST API.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)



## Introduction
This API is responsible for user authenticaion and authorization. There are two ways to register a user on a servr, one is regular (With email verification) and second is Google signin.
API also provides a way for users to recover their passwords if they forget the old one. The project has an advanced validation for passwords emails and etc.



## Features
For the authentication, this API uses both Access and Refresh tokens, both of them are realised using `Json Web Token`s.
Flow of signing in and registering using Google accounts:
Regular click on sign in with google, request from frontend come to a server, server authenticates to Google, then requests desired user credentials of an user,
based on the credentials and existence of user in a db, user ether just signs in or a new user is being created.

## Instalation

To install and run the pjoect, after cloning it from GitHub, `.env` file needs to be added in a root folder of the project.

1. Install packages with:
```` bash
    npm install
````
2. Build and run:
```` bash
    npm run dev
````