mongodump -h ds163835.mlab.com:63835 -d heroku_g1c54mwk -u heroku_g1c54mwk -p cgs872c7j891h8f8ls14vb5mu6 -o c:\classimanxBkp\
7z a C:\classimanxBkp\bkps\%date:~6,4%_%date:~3,2%_%date:~0,2%-%time:~0,2%-%time:~3,2%-%time:~6,2%.zip C:\classimanxBkp\heroku_g1c54mwk*
cd \src\iom-open-market\dataExtractor\
npm run test
