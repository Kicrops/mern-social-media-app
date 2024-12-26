import { Box, Button, Input, Text, VStack } from "@chakra-ui/react";
import { Toaster, toaster } from "./ui/toaster";
import { Field } from "./ui/field";
import { PasswordInput } from "./ui/password-input";
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = ({ setAuthMode }) => {
	const [userObject, setUserObject] = useState({
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		password: "",
		dateOfBirth: "",
	});
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		const res = await fetch("http://localhost:5000/api/users/register", {
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
				description: "User registered successfully",
				type: "success",
				duration: 6000,
			});
			localStorage.setItem("token", "Bearer " + data.token);
			setUserObject({
				firstName: "",
				lastName: "",
				username: "",
				email: "",
				password: "",
				dateOfBirth: "",
			});
			navigate("/");
		}
	};

	return (
		<Box width="400px" padding="6" boxShadow="lg" borderRadius="md">
			<Toaster />
			<form onSubmit={(e) => handleRegister(e)}>
				<VStack spacing="6">
					<Text as="h1" fontSize="2xl" fontWeight="bold" mb="6">
						Register Form
					</Text>
					<VStack width="100%" spacing="6">
						<Field label="First name" errorText="First name is required" required>
							<Input placeholder="First name" value={userObject.firstName} onChange={(e) => setUserObject({ ...userObject, firstName: e.target.value })} />
						</Field>
						<Field label="Last name" errorText="Last name is required" required>
							<Input placeholder="Last name" value={userObject.lastName} onChange={(e) => setUserObject({ ...userObject, lastName: e.target.value })} />
						</Field>
						<Field label="Username" errorText="Username is required" required>
							<Input placeholder="Username" value={userObject.username} onChange={(e) => setUserObject({ ...userObject, username: e.target.value })} />
						</Field>
						<Field label="Email" type="email" errorText="Email is required" required>
							<Input placeholder="Email" value={userObject.email} onChange={(e) => setUserObject({ ...userObject, email: e.target.value })} />
						</Field>
						<Field label="Password" errorText="Password is required" required>
							<PasswordInput placeholder="Password" value={userObject.password} onChange={(e) => setUserObject({ ...userObject, password: e.target.value })} />
						</Field>
						<Field label="Date of Birth" errorText="Date of Birth is required" required>
							<Input type="date" placeholder="Date of Birth" value={userObject.dateOfBirth} onChange={(e) => setUserObject({ ...userObject, dateOfBirth: e.target.value })} />
						</Field>
					</VStack>
					<Button bgColor="blue.600" width="100%" mt="6" _hover={{ bgColor: "blue.700" }} type="submit">
						Register
					</Button>
					<Text fontSize={"sm"}>
						Already have an account?{" "}
						<Text as="span" color="teal.500" cursor="pointer" onClick={() => setAuthMode("login")}>
							Login
						</Text>
					</Text>
				</VStack>
			</form>
		</Box>
	);
};

export default RegisterForm;
