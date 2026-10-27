# Orders Microservice

Microservicio de órdenes hecho con **NestJS**, **Prisma** y **PostgreSQL**, parte del proyecto del curso [NestJS + Microservicios](https://www.udemy.com/course/nestjs-microservicios/) (Udemy, DevTalles). Escucha mensajes de **NATS**; el acceso HTTP es a través del [client-gateway](https://github.com/developer-ortega-microservicios/client-gateway).

> Proyecto de práctica, **en progreso**. Se actualiza a medida que avanza el curso.

## Arquitectura

```
client-gateway  ──NATS──→  orders-ms  →  PostgreSQL (Prisma, Docker)
                              │
                              └──NATS──→  products-ms (validar productos)
```

Repositorios relacionados en la organización [developer-ortega-microservicios](https://github.com/developer-ortega-microservicios).

## Funcionalidades

- Creación de órdenes con sus ítems (relación maestro-detalle)
- Validación de los productos y precios consultando a `products-ms`
- Consulta de una orden por id, con su detalle
- Listado paginado con filtro por estado (`PENDING`, `DELIVERED`, `CANCELLED`)
- Cambio de estado de la orden
- Manejo de excepciones RPC
- Variables de entorno validadas con **Joi**

## Modelo de datos

- **Order**: `id`, `totalAmount`, `totalItems`, `status`, `paid`, `paidAt`, `createdAt`, `updatedAt`
- **OrderItem**: `id`, `productId`, `quantity`, `price`, relación con `Order`

## Stack técnico

- **NestJS** + **TypeScript**
- **Prisma** + **PostgreSQL 16** (en Docker)
- **NATS** (`@nestjs/microservices`)
- **Joi** y **class-validator**
- **Vitest**, **Oxlint** y **Prettier**

## Cómo correrlo localmente

1. Tener corriendo el servidor de NATS (ver el README del [client-gateway](https://github.com/developer-ortega-microservicios/client-gateway)).

2. Clonar e instalar:
   ```bash
   git clone https://github.com/developer-ortega-microservicios/orders-ms.git
   cd orders-ms
   npm install
   ```
   Si npm falla con `Cannot read properties of null (reading 'edgesOut')`, usar `npm install --legacy-peer-deps`.

3. Crear un archivo `.env` en la raíz (usar `.env.example` como referencia), con tus propias credenciales:
   ```
   PORT=3002
   NATS_SERVERS=nats://localhost:4222

   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=tu_clave
   POSTGRES_DB=ordersdb
   DATABASE_URL="postgresql://postgres:tu_clave@localhost:5432/ordersdb?schema=public"
   ```

4. Levantar PostgreSQL con Docker (usa las variables del `.env`):
   ```bash
   docker compose up -d
   ```

5. Generar el cliente de Prisma y aplicar las migraciones:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
   El cliente generado (`src/generated/prisma`) no se sube al repositorio, por eso hay que ejecutar `prisma generate`.

6. Iniciar en modo desarrollo:
   ```bash
   npm run start:dev
   ```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto del servicio |
| `NATS_SERVERS` | Servidores de NATS, separados por coma |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Credenciales de PostgreSQL (las usa `docker-compose.yml`) |
| `DATABASE_URL` | Cadena de conexión para Prisma |

## Scripts disponibles

```bash
npm run start:dev   # Desarrollo con recarga automática
npm run build       # Compila a /dist
npm run start:prod  # Ejecuta el build
npm run lint        # Oxlint
npm run test        # Pruebas unitarias
```
