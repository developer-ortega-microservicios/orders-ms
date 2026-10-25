import 'dotenv/config';
import joi from 'joi';

interface EnvVars {
    PORT: number;
    ORDERS_MICROSERVICE_HOST: string;
    ORDERS_MICROSERVICE_PORT: number;
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    ORDERS_MICROSERVICE_HOST: joi.string().required(),
    ORDERS_MICROSERVICE_PORT: joi.number().required()
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
    ordersMicroservicePort: envVars.ORDERS_MICROSERVICE_PORT
}