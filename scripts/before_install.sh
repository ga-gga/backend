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