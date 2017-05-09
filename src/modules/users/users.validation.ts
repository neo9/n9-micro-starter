export const createUser = {
	type: 'object',
	properties: {
		firstName: { type: 'string', minLength: 2 },
		lastName: { type: 'string', minLength: 2 },
		email: { type: 'string', pattern: 'email' },
		password: { type: 'string', minLength: 8 }
	}
}
