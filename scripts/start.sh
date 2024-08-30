#!bin/sh

bun i
bun tailwind-build 
export NIX_CONFIG="access-tokens = github.com=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"
bun run build .
pip install -r src/py-receipt-server/requirements.txt --break-system-packages
python -m src.py-receipt-server.app &
bun run start 
