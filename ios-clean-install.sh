cd ios
pod deintegrate
pod cache clean --all
rm -rf Pods
rm Podfile.lock
pod install
cd ..
npx react-native clean
