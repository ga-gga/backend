echo "Starting after_install.sh..."

cd /opt/gagga-app

npm ci --only=production --silent

sudo chown -R ec2-user:ec2-user /opt/gagga-app
chmod +x /opt/gagga-app/scripts/*.sh

sudo mkdir -p /home/ec2-user/.pm2
sudo chown -R ec2-user:ec2-user /home/ec2-user/.pm2

echo "after_install.sh completed"
