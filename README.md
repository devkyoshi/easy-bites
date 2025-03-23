EasyBites
======================
----

## Table of Contents

- [Introduction](#introduction)
- [Technologies](#technologies)
- [Features](#features)
- [Installation](#installation)
- [API Gateway](#api-gateway)
- [Authentication Service](#authentication-service)

## Introduction

**EasyBites** is a food delivery application that allows users to order food from different restaurants. The application consists of six services: the API Gateway, the Authentication Service, and the Restaurant Service, Order Service, Delivery Service and Payment Gateway. The API Gateway is the entry point for all requests and routes them to the appropriate service. The Authentication Service is responsible for user registration, user authentication and all user related endpoints. The Restaurant Service is responsible for managing restaurants and food items.

## Technologies

The project is created with:

- Backend - SpringBoot/Java 21
- Frontend - React Vite/Typescript - Shadcn UI Library

## Features

### User Management (Authentication Service)
- User Registration
- User Login
- User Logout


## Installation

To run this project, you need to create a PostgreSQL database 


Then, you need to update the `application.properties` file in the `authentication-service` directory with your database configuration.

```properties

#Spring Configurations
spring.application.name=authservice
server.port=8081

#JWT Configurations
jwt.secret=Y2hhbGxlbmdlZG9lMDAwMTIzNDU2Nzg5YWJjZGVmZ2hpamtsbW5vcHFycw==
jwt.expiration.ms=3600000

#DB Configurations
spring.datasource.url=jdbc:postgresql://localhost:5432/<<YOUR_DATABASE_NAME>>
spring.datasource.username=<<YOUR_USERNAME>>
spring.datasource.password=<<YOUR_PASSWORD>>
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.open-in-view=false
spring.jpa.hibernate.ddl-auto=update

```



## API Gateway

The API Gateway is the entry point for all requests and routes them to the appropriate service. The API Gateway is implemented using Spring Cloud Gateway.

## Authentication Service

- The Authentication Service is built using Springboot, and it's responsible for user registration, user authentication and all user related endpoints. 
- Factory design pattern is used to create users and roles. The service uses JWT for authentication and authorization.


