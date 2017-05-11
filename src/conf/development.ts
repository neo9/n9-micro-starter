const conf: Conf = {
	log: {
		level: 'info',
		http: 'dev'
	},
	mongo: {
		url: 'mongodb://127.0.0.1:27017/test'
	},
	jwt: {
		secret: 'secret_key',
		expiresIn: '30 days'
	},
	newRelic: {
		enabled: false
	}
}

export default conf
