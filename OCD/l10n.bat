@echo off
title l10n
git clone https://github.com/nenadTod/l10nAPI.git
cd l10nAPI
call npm install
title l10n
echo Prepared l10n server, am now trying to run it!
node server.js
pause