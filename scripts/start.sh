#!bin/sh

bun i
bun tailwind-build 
bun build 
bun start & 
bun python-service
