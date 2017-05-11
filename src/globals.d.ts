interface Package {
	name: string
	version: string
}

declare namespace NodeJS {
	interface Global {
		log: any,
		conf: Conf,
		db: any,
	}
}
