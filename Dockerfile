FROM oven/bun

# Set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json bun.lockb ./

# Run your build command# Install NVM, Node.js, and use it in one command to ensure the environment is preserved
RUN bun i

# RUN bun x tailwindcss -i src/server/views/tailwind.css -o public/output.css

# Copy all other project files
COPY . .

# Set environment to production
ENV NODE_ENV production

# Set default command to start the app
CMD [ "bun", "tailwind-build", "&&", "bun", "run", "build", "&&", "bun", "start" ]

