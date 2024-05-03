FROM oven/bun

# Set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json bun.lockb ./

# Switch to root to install dependencies
USER root

# Install dependencies required for NVM and Node.js
RUN apt-get update && apt-get install -y curl

# Run your build command# Install NVM, Node.js, and use it in one command to ensure the environment is preserved
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash \
    && . $HOME/.nvm/nvm.sh \
    && nvm install 20 \
    && nvm use 20 \
    && nvm alias default 20 \
    && npm install --production 

# RUN bun x tailwindcss -i src/server/views/tailwind.css -o public/output.css

# Copy all other project files
COPY . .

# Set environment to production
ENV NODE_ENV production

# Set default command to start the app
CMD [ "bun", "tailwind-build", "&&", "bun", "build", "&&" "bun", "start" ]

