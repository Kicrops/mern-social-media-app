import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Flex, For } from "@chakra-ui/react";
import UserCard from "../components/UserCard";

const Searchpage = () => {
	const { query } = useParams();
	const [users, setUsers] = useState([]);
	const [loggedUserId, setLoggedUserId] = useState(null);

	useEffect(() => {
		const fetchUsers = async () => {
			const res = await fetch(`http://localhost:5000/api/users/search/${query}`, {
				method: "GET",
				headers: {
					Authorization: `${localStorage.getItem("token")}`,
				},
			});
			const { success, data } = await res.json();
			if (success && loggedUserId) {
				const filteredData = data.filter((user) => user._id !== loggedUserId);
				setUsers(filteredData);
			}
		};
		fetchUsers();
	}, [query, loggedUserId]);

	useEffect(() => {
		const fetchLoggedUser = async () => {
			const res = await fetch(`http://localhost:5000/api/users/token`, {
				method: "GET",
				headers: {
					Authorization: `${localStorage.getItem("token")}`,
				},
			});
			const { success, data } = await res.json();
			setLoggedUserId(data._id);
		};
		fetchLoggedUser();
	}, []);

	return (
		<Flex direction="column" w="100%" h="100%" alignItems="center">
			<For
				each={users}
				fallback={
					<Flex w="100%" h="100%" alignItems="center" justifyContent="center">
						No users found
					</Flex>
				}>
				{(user, index) => <UserCard passedUser={user} key={user._id} loggedUserId={loggedUserId} />}
			</For>
		</Flex>
	);
};

export default Searchpage;
