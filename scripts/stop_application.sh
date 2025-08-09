echo "Starting stop_application.sh..."

if pm2 list 2>/dev/null | grep -q "gagga-app"; then
    pm2 stop gagga-app 2>/dev/null
    pm2 delete gagga-app 2>/dev/null
fi

PID=$(lsof -ti:3000 2>/dev/null)
[ ! -z "$PID" ] && kill -9 $PID 2>/dev/null

exit 0