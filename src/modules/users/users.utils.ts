import * as bcrypt from 'bcrypt'

export async function hashPassword(password: string) {
	const salt = await bcrypt.genSalt(10)

	return await bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, candidate: string) {
	return await bcrypt.compare(candidate, password)
}
