# Orders Microservice

Microservicio de órdenes hecho con **NestJS** y **TypeScript**, parte del proyecto del curso [NestJS + Microservicios](https://www.udemy.com/course/nestjs-microservicios/) (Udemy, DevTalles).

> Proyecto de práctica, **en progreso**. Se actualiza a medida que avanza el curso.

## Qué se va a construir

- Creación, consulta y cambio de estado de órdenes
- Paginación y filtros por estado
- Detalle de orden (maestro-detalle) con validación de productos contra `products-ms`
- Base de datos **PostgreSQL** (Docker) con **Prisma**
- Comunicación por Message Patterns (TCP, luego NATS)
- Validación de variables de entorno con **Joi**

## Arquitectura

```
client-gateway  →  orders-ms  →  products-ms
```

Repositorios relacionados en la organización [developer-ortega-microservicios](https://github.com/developer-ortega-microservicios).

## Stack técnico

- **NestJS** + **TypeScript**
- **Joi** — validación de variables de entorno
- **Prisma** + **PostgreSQL**
- **Vitest** — pruebas
- **Oxlint** y **Prettier** — calidad y formato del código

## Cómo correrlo localmente

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/developer-ortega-microservicios/orders-ms.git
   cd orders-ms
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```
   Si npm falla con `Cannot read properties of null (reading 'edgesOut')`, usar `npm install --legacy-peer-deps`.

3. Crear un archivo `.env` en la raíz (usar `.env.example` como referencia):
   ```
   PORT=3002
   ORDERS_MICROSERVICE_HOST=localhost
   ORDERS_MICROSERVICE_PORT=3002
   ```

4. Iniciar en modo desarrollo:
   ```bash
   npm run start:dev
   ```

## Scripts disponibles

```bash
npm run start:dev   # Desarrollo con recarga automática
npm run build       # Compila a /dist
npm run start:prod  # Ejecuta el build
npm run lint        # Oxlint
npm run test        # Pruebas unitarias
```
