#!/bin/bash
# Perform setup of database, markets and tags/categories
clear
cd ../../../server
rm db.sqlite3
python manage.py syncdb --noinput
python manage.py shell < scripts/updateMarkets.py
python manage.py shell < scripts/updateTagCategory.py
cd ../client/test/protractor/
# Set up Facebook and non-Facebook foodie accounts
protractor foodie-setup
# Set up Facebook and non-Facebook farmer accounts
protractor farmer-setup
# Set up a superuser (and call the Python script to actually make this user a superuser)
protractor super-user-setup
python ../../../server/manage.py shell < ../../../server/scripts/addSuperUser.py
# Test superuser functionality
protractor super-user-tests
# Test farmer functionality
protractor facebook-farmer-tests
# Test foodie functionality
protractor facebook-foodie-tests