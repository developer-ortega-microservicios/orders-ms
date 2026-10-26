import 'dotenv/config';
import joi from 'joi';

interface EnvVars {
    PORT: number;
    ORDERS_MICROSERVICE_HOST: string;
    ORDERS_MICROSERVICE_PORT: number;
    DATABASE_URL: string;
    PRODUCTS_MICROSERVICE_PORT: number;
    PRODUCTS_MICROSERVICE_HOST: string;
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    ORDERS_MICROSERVICE_HOST: joi.string().required(),
    ORDERS_MICROSERVICE_PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    PRODUCTS_MICROSERVICE_PORT: joi.number().required(),
    PRODUCTS_MICROSERVICE_HOST: joi.string().required()
})
.unknown(true);

const { error, value } = envSchema.validate( process.env );

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    ordersMicroserviceHost: envVars.ORDERS_MICROSERVICE_HOST,
    ordersMicroservicePort: envVars.ORDERS_MICROSERVICE_PORT,
    databaseUrl: envVars.DATABASE_URL,
    productsMicroserviceHost: envVars.PRODUCTS_MICROSERVICE_HOST,
    productsMicroservicePort: envVars.PRODUCTS_MICROSERVICE_PORT
}