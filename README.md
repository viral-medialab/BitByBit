# Setup

- Make sure you have mongo, npm, pip and virtualenv installed
- For mongo: http://docs.mongodb.org/manual/installation/
- For npm: http://nodejs.org/download/
- For pip:  https://pip.pypa.io/en/latest/installing.html
- For virtualenv:  $ pip install virtualenv

## Backend
--------
```
cd backend
mkdir virt_env
virtualenv virt_env/virt1 --no-site-packages
source virt_env/virt1/bin/activate
pip install -r requirements.txt (might need sudo)
mongod (make sure that mongo is runing in the background, might need sudo. Leave mongo running, in a new terminal, run 'mongo' to access console)
python application.py
```


## Frontend
--------
```
cd frontend
npm install
gulp
```
~~ Live on port 7000




