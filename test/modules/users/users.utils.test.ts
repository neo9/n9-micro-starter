import test from 'ava'

import { hashPassword, verifyPassword } from '../../../src/modules/users/users.utils'

test('hashPassword & verify = good', async (t) => {
	const password = '012345678'
	const hash = await hashPassword(password)
	t.not(hash, password)
	t.is(hash.length, 60)
	const match = await verifyPassword(hash, password)
	t.true(match)
})

test('hashPassword & verify = bad', async (t) => {
	const password = '012345678'
	const hash = await hashPassword(password)
	t.not(hash, password)
	t.is(hash.length, 60)
	const match = await verifyPassword(hash, 'bad')
	t.false(match)
})

test('hashPassword(null)', async (t) => {
	const error = await t.throws(hashPassword(null))
	t.is(error.message, 'data and salt arguments required')
	t.pass()
})
