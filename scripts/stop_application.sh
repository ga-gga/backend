cho "Starting stop_application.sh..."

sudo -u ec2-user bash -c "
  export HOME=/home/ec2-user
  export PM2_HOME=/home/ec2-user/.pm2
  
  if pm2 list 2>/dev/null | grep -q 'gagga-app'; then
    echo 'Stopping gagga-app via PM2...'
    pm2 stop gagga-app 2>/dev/null
    pm2 delete gagga-app 2>/dev/null
  fi
"

if pm2 list 2>/dev/null | grep -q "gagga-app"; then
    echo "Stopping gagga-app from root PM2..."
    pm2 stop gagga-app 2>/dev/null
    pm2 delete gagga-app 2>/dev/null
fi

PID=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$PID" ]; then
    echo "Killing process on port 3000: $PID"
    kill -9 $PID 2>/dev/null
fi

echo "Application stop completed"
exit 0