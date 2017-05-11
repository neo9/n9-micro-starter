import { Db, Collection } from 'mongodb'

const { name, mongo } = global.conf
const log = global.log.module('users')
const db: Db = global.db
const users: Collection = db.collection('users')

export default async () => {
	log.info('Ensuring email unique index')
	await users.createIndex({ email: 1 }, { unique: true })
}
