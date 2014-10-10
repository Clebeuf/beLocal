#!/bin/bash

echo "Please enter a user id:"

read id

curl -X POST http://127.0.0.1:8000/vendor/add/ -H "Content-Type: application/json" -d "{ \"address\" : {\"addr_line1\" : \"123 Farm Road\", \"city\" : \"Victoria\", \"state\" : \"BC\", \"country\" : \"Canada\", \"zipcode\" : \"1234\"}, \"user\": \"$id\", \"company_name\" : \"CompanyName\", \"webpage\" : \"www.WebPage.com\", \"country_code\" : \"250\", \"phone\" : \"1234567\", \"extension\" : \"123\"}"