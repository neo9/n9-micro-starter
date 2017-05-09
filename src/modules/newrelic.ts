const { name, newRelic } = global.conf
const log = require('debug')(`${name}:newrelic`)

if (newRelic && newRelic.enabled) {
	const newRelicConf = require('../../newrelic').config
	newRelicConf.license_key = newRelic.licenseKey || newRelicConf.license_key
	newRelicConf.filepath = newRelic.filepath || newRelicConf.filepath

	require('newrelic')
	log('newrelic API enabled')

	require('@newrelic/native-metrics')
	log('newrelic metrics enabled')
}
