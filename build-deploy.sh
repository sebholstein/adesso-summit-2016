cd pwa
rm -rf dist
ng build --prod --aot && ./node_modules/.bin/sw-precache --config=sw-precache-config.js --verbose
mv service-worker.js dist/
cd ..
./deploy.sh
