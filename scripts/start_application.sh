echo "Starting start_application.sh..."

cd /opt/gagga-app

REGION="ap-northeast-2"

ENV_VARS=$(aws ssm get-parameters --region $REGION \
  --names "/gagga/prod/NODE_ENV" "/gagga/prod/PORT" \
  "/gagga/prod/SEOUL_REAL_TIME_CITY_DATA_BASE_URL" \
  "/gagga/prod/SEOUL_REAL_TIME_CITY_DATA_FORMAT" \
  "/gagga/prod/SEOUL_REAL_TIME_CITY_DATA_SERVICE_TYPE" \
  "/gagga/prod/SEOUL_REAL_TIME_CITY_DATA_PAGING_START" \
  "/gagga/prod/SEOUL_REAL_TIME_CITY_DATA_PAGING_END" \
  --query "Parameters[*].[Name,Value]" --output text) || { echo "Parameter fetch failed"; exit 1; }

SECRETS=$(aws secretsmanager get-secret-value --region $REGION \
  --secret-id "gagga/prod/secrets" --query "SecretString" --output text) || { echo "Secrets fetch failed"; exit 1; }

{
  echo "$ENV_VARS" | awk -F'\t' '{gsub("/gagga/prod/", "", $1); print $1"="$2}'
  echo "MONGODB_URI=$(echo "$SECRETS" | jq -r '.MONGODB_URI')"
  echo "SEOUL_REAL_TIME_CITY_DATA_API_KEY=$(echo "$SECRETS" | jq -r '.SEOUL_REAL_TIME_CITY_DATA_API_KEY')"
} > .env.prod

pm2 start npm --name "gagga-app" -- run start:prod
pm2 save

if ! sudo systemctl list-unit-files | grep -q "pm2-ec2-user.service"; then
    sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user
fi

echo "Application started successfully"
