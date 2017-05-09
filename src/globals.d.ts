interface Package {
	name: string
	version: string
}

interface Conf {
	http?: {
		port: number
	}
	log?: {
		level: 'dev' | 'common' | 'combined' | 'short' | 'tiny'
	}
	mongo?: {
		url: string
	}
	newRelic?: {
		enabled: boolean
		licenseKey?: string
		filepath?: string
	}
	env?: string
	name?: string
	version?: string
}


declare namespace NodeJS {
	interface Global {
		conf: Conf,
		db: any
	}
}
