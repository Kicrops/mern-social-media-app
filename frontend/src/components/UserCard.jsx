import { React, useState, useEffect } from "react";
import { Button, Flex, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { Avatar } from "./ui/avatar";
import { Toaster, toaster } from "./ui/toaster";

const UserCard = ({ passedUser, key, loggedUserId }) => {
	const [followed, setFollowed] = useState("");
	const [user, setUser] = useState(passedUser);

	useEffect(() => {
		if (user && loggedUserId) {
			if (user._id === loggedUserId) {
				setFollowed("self");
			} else {
				const isFollowed = user.followers.includes(loggedUserId);
				setFollowed(isFollowed);
			}
		}
	}, [user, loggedUserId]);

	const handleFollow = async (userId, loggedUserId) => {
		const res = await fetch(`http://localhost:5000/api/users/${followed ? "unfollow" : "follow"}/${userId}`, {
			method: "PUT",
			headers: {
				Authorization: `${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: loggedUserId }),
		});
		const { success, data } = await res.json();
		if (success) {
			setUser(data);
			setFollowed(!followed);
			toaster.create({
				title: "Success",
				description: `User ${followed ? "unfollowed" : "followed"} successfully`,
				type: "success",
				duration: 1500,
			});
		}
	};

	if (!user) {
		return null;
	}

	return (
		<Flex borderWidth="1px" p="4" borderRadius="md" w="100%" justifyContent="space-between" alignItems="center" spacing="4" key={key}>
			<Toaster />
			<Link href={`/user/${user._id}`} key={key} _hover={{ textDecoration: "none" }} w="100%">
				<HStack maxW="70%">
					<Avatar src={user.profilePicture} alt="profile picture" size="md" name={user.firstName + " " + user.lastName} />
					<VStack justifyContent="center" ml="4" alignItems="start" gap="1" p="0">
						<Text fontWeight="600" as="span">
							@{user.username}
						</Text>
						<Text color="gray.500" as="span">
							{user.firstName} {user.lastName}
						</Text>
					</VStack>
				</HStack>
			</Link>
			{followed === "self" ? (
				""
			) : followed ? (
				<Button bgColor="red.600" _hover={{ bgColor: "red.700" }} mt={[4, 0]} onClick={() => handleFollow(user._id, loggedUserId)}>
					Unfollow
				</Button>
			) : (
				<Button bgColor="blue.600" _hover={{ bgColor: "blue.700" }} mt={[4, 0]} onClick={() => handleFollow(user._id, loggedUserId)}>
					Follow
				</Button>
			)}
		</Flex>
	);
};

export default UserCard;
