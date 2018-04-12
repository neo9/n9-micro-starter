import { Conf } from './index.d'

const conf: Conf = {
	http: {
		port: 6666
	},
	mongo: {
		url: 'mongodb://127.0.0.1:27017',
		dbName: 'n9-micro-test'
	},
	jwt: {
		secret: 'secret_key_test',
		expiresIn: '7 days'
	}
}

export default conf
