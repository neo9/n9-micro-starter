import debug from 'debug'
import { existsSync } from 'fs'
import { isArray, isObject, isRegExp, mergeWith } from 'lodash'
import { join } from 'path'

export const env: string = process.env.NODE_ENV || 'development'
const app: Package = require('../../package.json')
const confPath: string = process.env.NODE_CONF ? `${process.env.NODE_CONF}/${app.name}/` : '../conf/'
const log: any = debug(`${app.name}:conf`)

const files = [
	'../conf/application',
	`${confPath}${env}`
]
try {
	require('../conf/local')
	files.push('../conf/local')
} catch (e) {
	// local config is not found
}

const sources: Conf[] = []

files.forEach((name) => {
	log(`Loading ${name.split('/').slice(-1)} configuration`)
	sources.push(require(name).default)
})

sources.push({
	env,
	name: app.name,
	version: app.version
})

function customizer(objValue, srcValue) {
	if (isArray(objValue) && isArray(srcValue)) return srcValue
	if (isRegExp(objValue) || isRegExp(srcValue)) return srcValue
	if (isObject(objValue) || isObject(srcValue)) return mergeWith(objValue, srcValue, customizer)
}

export default mergeWith.apply(null, [ ...sources, customizer ])
