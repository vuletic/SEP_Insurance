@echo off
title sepinsmain
git clone https://github.com/vuletic/SEP_Insurance.git
java -jar adjustPaths.jar http://localhost:8080 http://localhost:8081
cd SEP_Insurance/SEP_Osiguranje
msbuild /target:package /p:packageLocation="..\..\sepinsmain\seposiguranje.zip"
cd ../../
del .\sepinsmain\seposiguranje.SetParameters.xml
xcopy .\seposiguranje.SetParameters.xml .\sepinsmain
cd sepinsmain
call seposiguranje.deploy.cmd /Y
echo SEP_Insurance main app should now be running on localhost!
pause
