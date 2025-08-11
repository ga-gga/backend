echo "Starting start_application.sh..."

cd /opt/gagga-app || { echo "Failed to change directory"; exit 1; }

REGION=$(curl -s --max-time 5 http://169.254.169.254/latest/meta-data/placement/region 2>/dev/null)
echo "Using AWS Region: $REGION"

ENV_VARS=$(aws ssm get-parameters --region $REGION \
  --names "/gagga/prod/NODE_ENV" "/gagga/prod/PORT" \
  "/gagga/prod/SEOUL_REAL_TIME_CITY_DATA_BASE_URL" \
  "/gagga/prod/SEOUL_REAL_TIME_CITY_DATA_FORMAT" \
  "/gagga/prod/SEOUL_REAL_TIME_CITY_DATA_SERVICE_TYPE" \
  "/gagga/prod/SEOUL_REAL_TIME_CITY_DATA_PAGING_START" \
  "/gagga/prod/SEOUL_REAL_TIME_CITY_DATA_PAGING_END" \
  --query "Parameters[*].[Name,Value]" --output text 2>&1)

if [ $? -ne 0 ]; then
    echo "Parameter fetch failed: $ENV_VARS"
    exit 1
fi

SECRETS=$(aws secretsmanager get-secret-value --region $REGION \
  --secret-id "gagga/prod/secrets" --query "SecretString" --output text 2>&1)

if [ $? -ne 0 ]; then
    echo "Secrets fetch failed: $SECRETS"
    exit 1
fi

{
  echo "$ENV_VARS" | awk -F'\t' '{gsub("/gagga/prod/", "", $1); print $1"="$2}'
  echo "MONGODB_URI=$(echo "$SECRETS" | jq -r '.MONGODB_URI')"
  echo "SEOUL_REAL_TIME_CITY_DATA_API_KEY=$(echo "$SECRETS" | jq -r '.SEOUL_REAL_TIME_CITY_DATA_API_KEY')"
} > .env.prod

chmod 600 .env.prod
chown ec2-user:ec2-user .env.prod

sudo -u ec2-user bash -c "
  export HOME=/home/ec2-user
  export PM2_HOME=/home/ec2-user/.pm2
  cd /opt/gagga-app
  
  pm2 delete gagga-app 2>/dev/null || true
  
  pm2 start npm --name 'gagga-app' -- run start:prod
  
  sleep 5
  pm2 list
  
  if pm2 list | grep -q 'gagga-app.*online'; then
    echo 'Application started successfully'
    pm2 save
  else
    echo 'Application failed to start'
    pm2 logs gagga-app --lines 20
    exit 1
  fi
"

if ! sudo systemctl list-unit-files | grep -q "pm2-ec2-user.service"; then
    echo "Setting up PM2 startup..."
    sudo -u ec2-user bash -c "
      export HOME=/home/ec2-user
      export PM2_HOME=/home/ec2-user/.pm2
      pm2 startup systemd -u ec2-user --hp /home/ec2-user | grep 'sudo' | bash
    "
fi

echo "Application deployment completed successfully"