@echo off
REM Starts the local MongoDB server (data persists in C:\Users\hp\mongodb-local\data)
"C:\Users\hp\mongodb-local\bin\mongod.exe" --dbpath "C:\Users\hp\mongodb-local\data" --bind_ip 127.0.0.1 --port 27017
