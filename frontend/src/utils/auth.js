export const isAuthenticated = async () => {
	try {
		const token = localStorage.getItem("token");
		if (!token) return false;
		const res = await fetch(`http://localhost:5000/api/users/token`, {
			method: "GET",
			headers: {
				Authorization: `${token}`,
			},
		});
		const { success } = await res.json();
    return success;
	} catch (error) {
		return false;
	}
};
