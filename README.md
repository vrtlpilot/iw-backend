1. Установить docker

2. Установить docker-compose

3. git clone https://github.com/pyshopml2/iw-backend.git

4. cd iw-backend

5. sudo mkdir -p /var/mongo-data

6. Создать файл .env со следующим содержимым:

7. ```
   PORT=3000
   DB_URI='mongodb://db:27017/ico_world_db'
   ```

   

8. docker-compose up -d

9. Приложение доступно по адресу http://icoworld.projects.oktend.com:3000/graphql

