// Add source map supports
import 'source-map-support/register'
import { join } from 'path'

// Dependencies
import n9Log from '@neo9/n9-node-log'
import n9Conf from '@neo9/n9-node-conf'
import n9Micro from '@neo9/n9-node-micro'
import n9Mongo from './modules/mongo'

// Handle Unhandled promise rejections
process.on('unhandledRejection', /* istanbul ignore next */ (err) => {
	throw err
})

// Load project conf & set as global
const conf = global.conf = n9Conf({ path: join(__dirname, 'conf') })
// Load logging system
const log = global.log = n9Log(conf.name, global.conf.log)
// Load loaded configuration
log.info(`Conf loaded: ${conf.env}`)

// Start method
async function start() {
	// Profile startup boot time
	log.profile('startup')
	// Connect to MongoDB
	const db = global.db = await n9Mongo(conf.mongo)
	// Load modules
	const { app, server } = await n9Micro({
		hasProxy: false, // Tell n9Micro that we don't use a proxy (like web-api)
		path: join(__dirname, 'modules'),
		http: conf.http,
		jwt: conf.jwt // only if hasProxy = false
	})
	// Log the startup time
	log.profile('startup')
	// Return server and more for testing
	return { server, db, conf }
}

export default start()
