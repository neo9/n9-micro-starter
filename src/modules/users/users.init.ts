import { Db, Collection } from 'mongodb'

export default async ({ log }) => {
	log = log.module('users')
	log.info('Ensuring email unique index')
	const users: Collection = global.db.collection('users')
	await users.createIndex({ email: 1 }, { unique: true })
}
