import * as winston from 'winston'

class N9Log {

	public info: winston.LeveledLogMethod
	public warn: winston.LeveledLogMethod
	public error: winston.LeveledLogMethod
	public profile: winston.LoggerInstance

	private name: string
	private level: 'error' | 'warn' | 'info'
	private log: winston.LoggerInstance

	constructor(name: string) {
		// Options
		this.name = name
		this.level = process.env.N9LOG || 'info'
		// Logger
		this.log = this.createLogger(this.level)
		// Add methods
		this.info = this.log.info.bind(this.log)
		this.warn = this.log.warn.bind(this.log)
		this.error = this.log.error.bind(this.log)
		this.profile = this.log.profile.bind(this.log)
	}

	public module(name: string) {
		return new N9Log(`${this.name}:${name}`)
	}

	private createLogger(level: string) {
		// Instanciate the logger
		return new winston.Logger({
			transports: [
				new winston.transports.Console({
					colorize: true,
					level: this.level,
					label: this.name
				})
			],
			levels: {
				error: 0,
				warn: 1,
				info: 2
			},
			colors: {
				info: 'cyan',
				warn: 'yellow',
				error: 'red'
			}
		})
	}

}

export default N9Log
