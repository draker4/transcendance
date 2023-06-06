import * as Joi from "joi";

export const	ValidationSchema = Joi.object({
	CLIENT_ID_42: Joi.string().required(),
	SECRET_42: Joi.string().required(),
	URL_42: Joi.string().required(),
	PORT_NESTJS: Joi.number().required(),
	HOST_NESTJS: Joi.string().required(),
	DATA_BASE_NAME: Joi.string().required(),
	DATA_BASE_HOST: Joi.string().required(),
	DATA_BASE_PORT: Joi.number(),
	DATA_BASE_USER: Joi.string().required(),
	DATA_BASE_PASSWORD: Joi.string().required(),
	DATA_BASE_SUP_USER: Joi.string().required(),
	DATA_BASE_SUP_PW: Joi.string().required(),
	JWT_SECRET: Joi.string().required(),
	CRYPTO_KEY: Joi.string().required(),
});
