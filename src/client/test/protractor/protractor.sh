#!/bin/bash
cd ../../../server
rm db.sqlite3
python manage.py syncdb --noinput
python manage.py shell < scripts/updateMarkets.py
python manage.py shell < scripts/updateTagCategory.py
cd ../client/test/protractor/
protractor vendor-setup
protractor foodie-setup
protractor facebook-farmer