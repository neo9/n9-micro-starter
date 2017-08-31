import { join } from 'path'
import * as rp from 'request-promise-native'
import * as stdMocks from 'std-mocks'

export let context: any = {}

export const get = (path, options = {}) => {
	return wrapLogs(rp({ method: 'GET', uri: url(path), resolveWithFullResponse: true, json: true, ...options }))
}
// tslint:disable-next-line:max-line-length
export const post = (path, options = {}) => {
	return wrapLogs(rp({ method: 'POST', uri: url(path), resolveWithFullResponse: true, json: true, ...options }))
}
// tslint:disable-next-line:max-line-length
export const put = (path, options = {}) => {
	return wrapLogs(rp({ method: 'PUT', uri: url(path), resolveWithFullResponse: true, json: true, ...options }))
}
// tslint:disable-next-line:max-line-length
export const del = (path, options = {}) => {
	return wrapLogs(rp({ method: 'DELETE', uri: url(path), resolveWithFullResponse: true, json: true, ...options }))
}

const url = (path: string = '/') => `http://localhost:${context.conf.http.port}` + join('/', path)

const wrapLogs = async (apiCall) => {
	// Store logs output
	stdMocks.use()
	// Call API & check response
	let res = null
	let err = null
	try {
		res = await apiCall
	} catch (error) {
		err = error
	}
	// Get logs ouput & check logs
	const { stdout, stderr } = stdMocks.flush()
	// Restore logs output
	stdMocks.restore()
	// Return err, res and output
	const body = (err ? err.response.body : res.body)
	const statusCode = (err ? err.statusCode : res.statusCode)
	const headers = (err ? err.response.headers : res.headers)
	return { statusCode, headers, body, stdout, stderr }
}
