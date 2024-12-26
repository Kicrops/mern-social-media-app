import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";
import { Toaster, toaster } from "./ui/toaster";
import { Field } from "./ui/field";
import { PasswordInput } from "./ui/password-input";
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ setAuthMode }) => {
	const [userObject, setUserObject] = useState({
		email: "",
		password: "",
	});
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		const res = await fetch("http://localhost:5000/api/users/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userObject),
		});
		const { success, data } = await res.json();
		if (!success) {
			console.log("Error");
			toaster.create({
				title: "Error",
				type: "error",
				description: data,
				duration: 6000,
			});
		} else {
			toaster.create({
				title: "Success",
				description: "User logged in successfully",
				type: "success",
				duration: 6000,
			});
			localStorage.setItem("token", "Bearer " + data.token);
			setUserObject({
				email: "",
				password: "",
			});
			navigate("/");
		}
	};

	return (
		<Box width="400px" padding="6" boxShadow="lg" borderRadius="md">
			<Toaster />
			<form onSubmit={handleLogin}>
				<VStack spacing="6">
					<Text as="h1" fontSize="2xl" fontWeight="bold" mb="6">
						Login Form
					</Text>
					<VStack width="100%" spacing="6">
						<Field label="Email" type="email" errorText="Email is required" required>
							<Input placeholder="Email" value={userObject.email} onChange={(e) => setUserObject({ ...userObject, email: e.target.value })} />
						</Field>
						<Field label="Password" errorText="Password is required" required>
							<PasswordInput placeholder="Password" value={userObject.password} onChange={(e) => setUserObject({ ...userObject, password: e.target.value })} />
						</Field>
					</VStack>
					<Button bgColor="blue.600" width="100%" mt="6" _hover={{ bgColor: "blue.700" }} type="submit">
						Login
					</Button>
					<Text fontSize={"sm"}>
						Don't have an account?{" "}
						<Text as="span" color="teal.500" cursor="pointer" onClick={() => setAuthMode("register")}>
							Register
						</Text>
					</Text>
				</VStack>
			</form>
		</Box>
	);
};

export default RegisterForm;
