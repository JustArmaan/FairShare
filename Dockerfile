FROM nixos/nix

# Set environment variables for non-interactive nix commands
ENV USER root

# Copy the flake.nix file to the container
COPY flake.nix /root/flake.nix

# Install Git as it's required for Nix flakes
RUN nix-env -iA nixpkgs.git


# Initialize the Nix flake environment
RUN nix flake init --experimental-features 'nix-command flakes'

COPY . .

# Run nix develop to set up the development environment
# RUN nix develop /root --experimental-features 'nix-command flakes' --command bash -c "echo 'Development environment ready'"


CMD [ "nix", "develop", "/root", "--experimental-features", "nix-command flakes", "--command", "bash", "-c", "bash scripts/start.sh"]
