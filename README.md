# Colendi Case

http://localhost:3000/swagger

``
docker compose up -d --build
``

``
docker exec -it colendi-case npx prisma migrate dev
``

``
docker exec -it colendi-case npx prisma db seed
``