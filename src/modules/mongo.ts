import debug from 'debug'
import { MongoClient, ObjectID, Db } from 'mongodb'

const { name, mongo } = global.conf
const log = debug(`${name}:mongo`)

export const connect = async () => {
	log(`Connecting to ${mongo.url}...`)
	global.db = await MongoClient.connect(mongo.url)
	log(`Connected to ${mongo.url}...`)
}

export const oid = (id) => new ObjectID(id)
