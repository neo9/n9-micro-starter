import { Conf } from './index.d'

const conf: Conf = {
	mongo: {
		url: 'mongodb://127.0.0.1:27017/test'
	},
	jwt: {
		secret: 'secret_key',
		expiresIn: '30 days'
	}
}

export default conf
