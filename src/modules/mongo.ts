import { MongoClient, ObjectID, Db } from 'mongodb'

export default async function (mongo) {
	const log = global.log.module('mongo')
	log.info(`Connecting to ${mongo.url}...`)
	const client = await MongoClient.connect(mongo.url, mongo.options)
	const db = client['db'](mongo.dbName)
	log.info(`Connected`)
	return db
}

export const oid = (id) => new ObjectID(id)
