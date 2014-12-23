#!/bin/bash
clear
cd ../../../server
rm db.sqlite3
python manage.py syncdb --noinput
python manage.py shell < scripts/updateMarkets.py
python manage.py shell < scripts/updateTagCategory.py
cd ../client/test/protractor/
protractor foodie-setup
protractor farmer-setup
protractor super-user-setup
python ../../../server/manage.py shell < ../../../server/scripts/addSuperUser.py
protractor super-user-tests
protractor facebook-farmer-tests