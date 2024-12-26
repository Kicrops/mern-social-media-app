import { Routes, Route, Navigate } from "react-router-dom";
import Userpage from "./pages/Userpage.jsx";
import Postpage from "./pages/Postpage.jsx";
import Authpage from "./pages/Authpage.jsx";
import NotFound from "./pages/NotFound.jsx";
import Mainpage from "./pages/Mainpage.jsx";
import Searchpage from "./pages/Searchpage.jsx";
import Navbar from "./components/Navbar.jsx";

import { isAuthenticated } from "./utils/auth.js";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
	const [auth, setAuth] = useState("");
	useEffect(() => {
		const checkAuth = async () => {
			const result = await isAuthenticated();
			setAuth(result);
		};
		checkAuth();
	}, []);
	if (auth === "") {
		return null;
	}
	return auth ? children : <Navigate to="/auth" />;
};

const App = () => {
	return (
		<Routes>
			<Route path="/auth" element={<Authpage />} />
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<Navbar />
						<Mainpage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/user/:id"
				element={
					<ProtectedRoute>
						<Navbar />
						<Userpage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/post/:id"
				element={
					<ProtectedRoute>
						<Navbar />
						<Postpage />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/search/:query"
				element={
					<ProtectedRoute>
						<Navbar />
						<Searchpage />
					</ProtectedRoute>
				}
			/>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};

export default App;
