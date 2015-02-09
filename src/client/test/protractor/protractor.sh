#!/bin/bash
# Perform setup of database, markets and tags/categories
clear
cd ../../../server
echo "Backing up sqlite database"
if [ -a db.sqlite3 ]; 
then
    echo "backing up sqlite3 database"
    mv db.sqlite3 db.sqlite3.backup
fi
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

# Put back the backed up database
read -p "Do you want to restore the database? <Y/N> " prompt 
if [ $prompt == "y" || $prompt == "Y" ]; 
then
    cd ../../../server
    if [ -a db.sqlite3.backup ]; 
    then
        rm db.sqlite3
        mv db.sqlite3.backup db.sqlite3
        echo "Database restored."
    else
        echo "Cannot restore database. No backup found."
    fi
fi
