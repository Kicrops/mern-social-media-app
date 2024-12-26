import { React, useState } from "react";
import { Box, Center } from "@chakra-ui/react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const Authpage = () => {
	const [authMode, setAuthMode] = useState("login");
	return <Center height="100vh">{authMode === "login" ? <LoginForm setAuthMode={setAuthMode} /> : <RegisterForm setAuthMode={setAuthMode} />}</Center>;
};

export default Authpage;
