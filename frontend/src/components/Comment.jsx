import { Box, HStack, Link, Text, VStack, IconButton } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa6";
import { Avatar } from "./ui/avatar";
import { React, useState, useEffect } from "react";

const Comment = ({ comment, deleteComment }) => {
	const [user, setUser] = useState(null);
	useEffect(() => {
		const fetchUser = async () => {
			const res = await fetch(`http://localhost:5000/api/users/${comment.user}`, {
				method: "GET",
				headers: {
					Authorization: `${localStorage.getItem("token")}`,
				},
			});
			const { success, data } = await res.json();
			setUser(data);
		};
		fetchUser();
	}, [comment]);
	if (!user) {
		return null;
	}
	return (
		<Box w="100%" p={2} borderWidth="1px" borderRadius="lg" mt="3">
			<VStack>
				<Link href={`/user/${user._id}`} w="100%">
					<HStack flexDirection={"row"} w="100%" alignItems="center" justifyContent="flex-start">
						<Avatar src={user.profilePicture} alt="profile picture" size="2xs" shape="full" name={user.firstName + " " + user.lastName} />
						<Text as="span" w="100%" textAlign={"left"} fontSize="sm">
							@{user.username}
						</Text>
					</HStack>
				</Link>
				<HStack w="100%" justifyContent="space-between">
					<Text as="span" textAlign="left" w="100%" ml="10">
						{comment.text}
					</Text>
					{deleteComment && (
						<IconButton aria-label="Delete comment" onClick={() => deleteComment(comment._id)} size="2xs" variant="ghost" color="gray.500" _hover={{ color: "red.500" }}>
							<FaTrash />
						</IconButton>
					)}
				</HStack>
				<Text as="span" w="100%" textAlign={"right"} fontSize="2xs" mt="2" color="gray.400">
					{new Date(comment.date).toLocaleString()}
				</Text>
			</VStack>
		</Box>
	);
};

export default Comment;
