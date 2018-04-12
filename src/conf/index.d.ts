import { N9Log } from '@neo9/n9-node-log'
import { N9Micro } from '@neo9/n9-node-micro'

export interface Conf {
	// n9-micro config
	http?: N9Micro.HttpOptions
	jwt?: N9Micro.JWTOptions
	log?: N9Log.Options
	env?: string
	name?: string
	version?: string
	// Custom config
	mongo?: {
		url: string,
		dbName: string
	}
	io?: {
		enabled: boolean
	}
}
