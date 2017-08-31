export function create(user) {
	return {
		userId: user._id || user.userId,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName
	}
}
