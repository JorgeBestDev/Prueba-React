Ejecutar comandos:


Backend:
fnm env --use-on-cd | Out-String | Invoke-Expression
fnm use --install-if-missing 22
npm install cors express multer convert-csv-to-json
npm install @types/express -D
npm install @types/cors -D
npm install @types/multer -D
npm install @types/convert-csv-to-json -D
npm run dev


Frontend:
npm create vite
cd frontend
npm install sonner
npm install cross-env --save-dev
npm install @uidotdev/usehooks
npm install
npm run dev