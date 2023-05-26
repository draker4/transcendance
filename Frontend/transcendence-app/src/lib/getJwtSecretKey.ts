export const getJwtSecretKey = () => {
	const	secret = "secretTestcvjfrnkj";//process.env.JWT_SECRET_KEY

	if (!secret || secret.length === 0) {
		throw new Error('The environment variable JWT_SERET_KEY is not set');
	}

	return secret;
}
