import { Db, ObjectID, FindOneOptions } from 'mongodb'

import { oid } from '../mongo'
import { hashPassword } from './users.utils'

const db: Db = global.db
const users = db.collection('users')

export async function create(user) {
	// Hash password
	user.password = await hashPassword(user.password)
	// Add date creation
	user.createdAt = new Date()
	// Save to database
	await users.insertOne(user)
	// Send back user
	return user
}

export async function getById(userId: string) {
	return await findOne({ _id: oid(userId) })
}

export async function getByEmail(email: string) {
	return await findOne({ email })
}

export async function findOne(query: object, options?: FindOneOptions) {
	return await users.findOne(query, options)
}
