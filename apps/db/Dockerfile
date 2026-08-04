FROM mongo:4.2

# Bind mounts don't work in Testcontainers, need to copy it into the image
COPY init-replica-set.js /docker-entrypoint-initdb.d/init-replica-set.js

CMD ["mongod", "--replSet", "rs0", "--bind_ip_all"]
