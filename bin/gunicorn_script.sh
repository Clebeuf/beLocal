# Change directory
cd $HOME/Projects/beLocal/src/server

# Run gunicorn
gunicorn server.wsgi:application --bind=localhost:8001 --access-logfile $HOME/Projects/beLocal/logs/gunicorn.log &
