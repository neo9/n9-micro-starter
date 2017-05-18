import { N9Log } from 'n9-node-log'
import { N9Micro } from 'n9-node-micro'

export interface Conf {
	http?: N9Micro.HttpOptions
	log?: N9Log.Options
	mongo?: {
		url: string
	}
	io?: {
		enabled: boolean
	}
	jwt?: {
		secret: string,
		expiresIn: string | number
	}
	env?: string
	name?: string
	version?: string
}
