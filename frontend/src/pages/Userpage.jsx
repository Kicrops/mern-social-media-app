import { Button, Center, Flex, Heading, Spinner, Text, VStack, For } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Post from "../components/Post";
import EditProfile from "../components/EditProfile";
import UserCard from "../components/UserCard";
import { Avatar } from "../components/ui/avatar";
import { Toaster, toaster } from "../components/ui/toaster";
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "../components/ui/dialog";

const Userpage = () => {
	const { id } = useParams();
	const [user, setUser] = useState(null);
	const [loggedUserId, setLoggedUserId] = useState(null);
	const [posts, setPosts] = useState([]);
	const [followed, setFollowed] = useState("");
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);

	const navigate = useNavigate();
	useEffect(() => {
		const fetchUser = async () => {
			const res = await fetch(`http://localhost:5000/api/users/${id}`, {
				method: "GET",
				headers: {
					Authorization: `${localStorage.getItem("token")}`,
				},
			});
			const { success, data } = await res.json();
			if (!success) {
				return navigate("/404");
			}
			setUser(data);
			console.log(data);
			setPosts(data.posts.reverse());
		};
		fetchUser();
	}, [id]);

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

	useEffect(() => {
		const fetchFollowers = async () => {
			const res = await fetch(`http://localhost:5000/api/users/followers/${id}`, {
				method: "GET",
				headers: {
					Authorization: `${localStorage.getItem("token")}`,
				},
			});
			const { success, data } = await res.json();
			setFollowers(data);
		};
		const fetchFollowing = async () => {
			const res = await fetch(`http://localhost:5000/api/users/following/${id}`, {
				method: "GET",
				headers: {
					Authorization: `${localStorage.getItem("token")}`,
				},
			});
			const { success, data } = await res.json();
			setFollowing(data);
		};
		fetchFollowers();
		fetchFollowing();
	}, [id]);

	if (!user) {
		return (
			<Center height="100vh">
				<Spinner size="xl" />
			</Center>
		);
	}

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

	return (
		<Center w="100%" py="10">
			<Toaster />
			<VStack spacing="10" w="80%" maxW="800px">
				<Flex w="100%" direction={{ md: "row", sm: "column" }} alignItems="center" justifyContent="space-between" bg="gray.50" p="6" rounded="lg" shadow="md">
					<Avatar src={user.profilePicture} alt="profile picture" boxSize="120px" shape="full" name={user.firstName + " " + user.lastName} />
					<VStack textAlign={{ md: "left", sm: "center" }} mt={{ md: 4, sm: 0 }} ml={{ md: 6, sm: 0 }} w={{ md: "60%", sm: "100%" }} gap="0" alignItems={{ md: "start", sm: "center" }}>
						<Heading size="md" as="span" mt="4">
							@{user.username}
						</Heading>
						<Text fontSize="lg" as="span" mt="2">
							{user.firstName} {user.lastName}
						</Text>
						{user.location ? (
							<Text fontSize="sm" color="gray.500" as="span" mt="1" alignItems="center">
								{user.location}
							</Text>
						) : (
							""
						)}
						{user.bio ? (
							<Text fontSize="md" mt="4">
								{user.bio}
							</Text>
						) : (
							""
						)}
						<Flex mt="4" justifyContent="space-between" alignItems="center" w="100%">
							<Button variant="ghost" fontWeight="500" color="black" fontSize="sm" cursor="default">
								Posts: {user.posts.length}
							</Button>

							<DialogRoot>
								<DialogTrigger asChild>
									<Button variant="ghost" fontWeight="500" color="black" cursor="pointer" fontSize="sm" _hover={{ textDecoration: "underline" }}>
										Followers: {user.followers.length}
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Followers</DialogTitle>
										<DialogCloseTrigger />
									</DialogHeader>
									<DialogBody>
										<VStack>
											<For
												each={followers}
												fallback={
													<Text fontSize="sm" color="gray.800">
														No followers yet
													</Text>
												}>
												{(user) => <UserCard passedUser={user} key={user._id} loggedUserId={loggedUserId} />}
											</For>
										</VStack>
									</DialogBody>
								</DialogContent>
							</DialogRoot>

							<DialogRoot>
								<DialogTrigger asChild>
									<Button variant="ghost" fontWeight="500" color="black" cursor="pointer" fontSize="sm" _hover={{ textDecoration: "underline" }}>
										Following: {user.following.length}
									</Button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Following</DialogTitle>
										<DialogCloseTrigger />
									</DialogHeader>
									<DialogBody>
										<VStack>
											<For
												each={following}
												fallback={
													<Text fontSize="sm" color="gray.800">
														Not following anyone yet
													</Text>
												}>
												{(user) => <UserCard passedUser={user} key={user._id} loggedUserId={loggedUserId} />}
											</For>
										</VStack>
									</DialogBody>
								</DialogContent>
							</DialogRoot>
						</Flex>
					</VStack>
					{followed == "self" ? (
						<EditProfile user={user} />
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
				<VStack spacing="10" w="100%">
					<For
						each={posts}
						fallback={
							<Center w="100%" h="200px">
								<Text fontSize="lg" color="gray.600">
									No posts yet
								</Text>
							</Center>
						}>
						{(postId) => <Post key={postId} postId={postId} showComments={false} loggedUserId={loggedUserId} />}
					</For>
				</VStack>
			</VStack>
		</Center>
	);
};

export default Userpage;
