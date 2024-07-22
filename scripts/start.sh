#!/bin/sh

# Activate Node.js environment and start the Node.js app

nix develop
bun i
bun i "express@>=5.0.0-beta.1"

export NODE_ENV="production"

bun run tailwind-build
bun run build 
bun run start &

echo "bun app started"

# Activate Python environment and start the Python app

cd src/py-receipt-server
nix develop
python -m venv .venv 
source .venv/bin/activate 
pip install -r requirements.txt 
python -m app &

echo "python app started"
