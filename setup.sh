cp .env.example .env

npm i

npm run build

docker-compose up -d

npm run migration:run
