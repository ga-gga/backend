echo "Starting before_install.sh..."

sudo mkdir -p /opt/gagga-app /var/log/gagga-app
sudo chown -R ec2-user:ec2-user /opt/gagga-app /var/log/gagga-app

if ! command -v aws &> /dev/null; then
    curl -s "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip -q awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
fi

if ! command -v jq &> /dev/null; then
    sudo dnf install -y jq
fi

if ! command -v node &> /dev/null; then
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo dnf install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

echo "before_install.sh completed"
