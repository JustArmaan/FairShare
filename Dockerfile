FROM nixos/nix

# Set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json bun.lockb ./

# Copy all other project files
COPY . .

RUN echo $(ls -1 /tmp/dir)

# Set default command to start the app
CMD [ "sudo bash /usr/src/app/scripts/start.sh" ]
