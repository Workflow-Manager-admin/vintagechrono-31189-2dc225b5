#!/bin/bash
cd /home/kavia/workspace/code-generation/vintagechrono-31189-2dc225b5/vintage_chrono
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

