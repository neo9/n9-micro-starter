// Add source map supports
import 'source-map-support/register'
import { join } from 'path'

// Dependencies
import n9Log from 'n9-node-log'
import n9Conf from 'n9-node-conf'
import n9Micro from 'n9-node-micro'
import n9Mongo from './modules/mongo'

// Load project conf & set as global
const conf = global.conf = n9Conf({ path: join(__dirname, 'conf') })
// Load logging system
const log = global.log = n9Log(conf.name, global.conf.log)
// Load loaded configuration
log.info(`Conf loaded: ${conf.env}`)

// Start method
export default async function start() {
	// Profile startup boot time
	log.profile('startup')
	// Connect to MongoDB
	global.db = await n9Mongo(conf.mongo)
	// Load modules
	const { app, server } = await n9Micro({
		path: join(__dirname, 'modules'),
		http: conf.http
	})
	// Log the startup time
	log.profile('startup')
}

// Start only when not testing
start()
