#!bin/sh

bun i
bun tailwind-build 
bun run build .
bun run start # &
# pip install -r src/py-receipt-server/requirements.txt --break-system-packages
# python -m src.py-receipt-server.app 
