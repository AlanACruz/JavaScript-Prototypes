# Copyright (C) 2021 Alan Cruz
# JavaScript-Prototypes

# Git Clone
```
git clone git@github.com:AlanACruz/JavaScript-Prototypes.git ~/git/JavaScript-Prototypes
```

# Install Docker on Chromebook
https://github.com/AlanACruz/DevSecOps/blob/master/docker/Install-Docker-On-Chromebook.md

# Build Container
```
docker build \
    -t js-prototypes \
    ~/git/JavaScript-Prototypes
```

# Run Container
```
docker run \
    -i \
    -t \
    --rm \
    --name js-prototypes \
    js-prototypes
```

# NPM Script Commands
https://github.com/AlanACruz/JavaScript-Prototypes/blob/e5c7ba4dc63ec9cdfa9131256f4fde01c60c7827/package.json#L6-L10

# Run Node Build Locally
```
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt-get install -y nodejs

npm install \
   --save \
   mocha \
   chai \
   fs \
   request \
   express \
   forever 

npm start

npm test

npm stop
```

# Browser Access
From browser -> localhost:3000
