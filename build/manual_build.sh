node_modules/.bin/electron-packager dist Vortex --out=releases --platform=win32 --arch=ia32 --version=1.2.0 app-version=1.0 --icon=resources/windows/icon.ico --asar=true --overwrite

node_modules/.bin/electron-packager dist Vortex --out=releases --platform=win32 --arch=x64 --version=1.2.0 app-version=1.0 --icon=resources/windows/icon.ico --asar=true --overwrite

node_modules/.bin/electron-packager dist Vortex --out=releases --platform=linux --arch=ia32 --version=1.2.0 app-version=1.0 --icon=resources/icon.png --asar=true --overwrite

node_modules/.bin/electron-packager dist Vortex --out=releases --platform=linux --arch=x64 --version=1.2.0 app-version=1.0 --icon=resources/icon.png --asar=true --overwrite

node_modules/.bin/electron-packager dist Vortex --out=releases --platform=darwin --arch=x64 --version=1.2.0 app-version=1.0 --icon=resources/osx/icon.icns --asar=true --overwrite
