# Change directory
cd /home/ubuntu/beLocal.com/beLocal/src/server

# Run gunicorn
gunicorn server.wsgi:application --bind=localhost:8001 --access-logfile /home/ubuntu/beLocal.com/logs/gunicorn.log &