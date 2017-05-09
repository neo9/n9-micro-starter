import { Db, ObjectID, FindOneOptions } from 'mongodb'

import { oid } from '../mongo'
import { hashPassword } from './users.utils'

const db: Db = global.db

export async function create(user) {
	const users = db.collection('users')

	// Hash password
	user.password = await hashPassword(user.password)
	// Add date creation
	user.createdAt = new Date()
	// Save to database
	await users.insertOne(user)
	// Send back user
	return user
}

export async function findOne(query: object, options?: FindOneOptions) {
	const users = db.collection('users')

	return await users.findOne(query, options)
}
