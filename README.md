# Copyright (C) 2021 Alan Cruz
# JavaScript-Prototypes

# git clone
git clone git@github.com:AlanACruz/JavaScript-Prototypes.git ~/git/

# install docker
sudo apt update

sudo apt install -y \
   apt-transport-https \
   ca-certificates \
   curl \
   gnupg2 \
   software-properties-common

curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"
   
sudo apt update

sudo apt install -y \
   docker-ce \
   docker-ce-cli \
   containerd.io

# Enable non-root docker (Chromebook)
sudo usermod -aG docker $USER

sudo chmod 666 /var/run/docker.sock

# Pull Maven container
docker pull node:current

# Run Node build from container
docker build \
    -t js-prototypes \
    ~/git/JavaScript-Prototypes

docker run \
    -i \
    -t \
    --rm \
    --name js-prototypes \
    js-prototypes

# Run Maven build locally
sudo apt-get install -y \
   openjdk-11-jdk \
   maven

cd ~/git/Java-Prototypes

mvn install