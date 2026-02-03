#!/bin/bash

# 1. Levantar la base de datos si no está corriendo
docker-compose up -d postgres

# 2. Esperar a que Postgres esté listo (bucle de verificación)
echo "⏳ Esperando a que la base de datos esté lista..."
until docker exec postgres pg_isready -U vstats; do
  sleep 2
done

echo "✅ Base de datos lista."

# 3. Compilar y arrancar la aplicación
# Al arrancar, Flyway ejecutará automáticamente los archivos en db/migration
echo "🏃 Arrancando el backend (Flyway ejecutará migraciones automáticamente)..."
./mvnw spring-boot:run