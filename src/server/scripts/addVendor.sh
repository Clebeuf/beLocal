#!/bin/bash

echo "Please enter a user id:"

read id

curl -X POST http://127.0.0.1:8000/vendor/add/ -H "Content-Type: application/json" -d "{ \"description\" : \"This is a very short description about a really awesome vendor.\", \"address\" : {\"hours\" : [], \"addr_line1\" : \"456 Country Road\", \"city\" : \"Victoria\", \"state\" : \"BC\", \"country\" : \"Canada\", \"zipcode\" : \"V8M3E3\"}, \"user\": \"$id\", \"company_name\" : \"Summer Hills Farms\", \"webpage\" : \"www.summerhillsfarms.com\", \"country_code\" : \"250\", \"phone\" : \"5733046\", \"extension\" : \"3463\", \"photo\" : \"\"}"
