
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
ok: { user: информация о пользователе }
error: { error: сообщение об ошибке }
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
ok: { user: информация о пользователе }
error: { error: сообщение об ошибке }
```
```
Request
GET /logout

Response
"logout"
```
---
