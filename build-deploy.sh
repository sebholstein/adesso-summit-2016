cd pwa
ng build --prod --aot && ./node_modules/.bin/sw-precache --root=dist --static-file-globs='dist/**/*'
cd ..
./deploy.sh
