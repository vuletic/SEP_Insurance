@echo off
title rulesAPI
git clone https://github.com/nenadTod/RulesAPI.git
java -jar adjustCorsPaths.jar http://localhost 
cd RulesAPI
call mvn clean
call mvn install
cd target
java -jar rule-API-0.1.0.jar