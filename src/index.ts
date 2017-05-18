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
const log = global.log = n9Log(global.conf.name, global.conf.log)
// Load loaded configuration
log.info(`Conf loaded: ${global.conf.env}`)

// Profile startup boot time
log.profile('startup')

// Init method
async function init() {
	// Connect to MongoDB
	global.db = await n9Mongo(global.conf.mongo)
	// Load modules
	const { app, server } = await n9Micro({
		path: join(__dirname, 'modules'),
		http: global.conf.http
	})
	// Log the startup time
	log.profile('startup')
}

// Start
init()
