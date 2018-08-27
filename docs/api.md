
#  API Documentation
#### Base URL: http://icoworld.projects.oktend.com:3000

## Registration
```
Request
POST /signup
{
    "firstName": "",
    "lastName": ""
    "email": "",
    "password": ""
}

Response
ok: { user: an user informaion }
error: { error: an error info if any }
```
## Authentication
```
Request
POST /login
{
  "email": "",
  "password": ""
}

Response
ok: { user: an user informaion }
error: { error: an error info if any }
```
```
Request
GET /logout

Response
"logout"
```

## Variables
```
PORT: the main server port.
DB_URI: url to connect to mongo db.
NODE_ENV: current server mode. Two values available "development" and "production".
SESSION_KEYS: a key value to secure session cookie content.

ETH_NODE_URL: ethereum node url the server should connect to.
ETH_FROM_ACCOUNT: account value attached to backend (optional). Default is coinbase value.
ETH_DEPLOY_PRICE: default price value we'll pay for a transaction (optional). Default is 100000.
ETH_WAIT_TIMEOUT: wait for block timeout value in ms (optional). Default is 1000.

---
