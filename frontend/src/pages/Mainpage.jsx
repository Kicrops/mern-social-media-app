import { Center, Flex, For } from "@chakra-ui/react";
import { React, useState, useEffect } from "react";
import Post from "../components/Post";

const Mainpage = () => {
	const [posts, setPosts] = useState([]);
	const [loggedUserId, setLoggedUserId] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			const res = await fetch(`http://localhost:5000/api/posts/following/${loggedUserId}`, {
				method: "GET",
				headers: {
					Authorization: `${localStorage.getItem("token")}`,
				},
			});
			const { success, data } = await res.json();
			setPosts(data.reverse());
		};
		if (loggedUserId) {
			fetchPosts();
		}
	}, [loggedUserId]);

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
		<Center w="100%" h="100%">
			<Flex direction="column" w="100%" h="100%" alignItems="center" maxW="800px">
				<For each={posts} fallback={<Center>No posts to show. Follow accounts to see their posts</Center>}>
					{(post) => <Post key={post._id} postId={post._id} showComments={false} loggedUserId={loggedUserId} />}
				</For>
			</Flex>
		</Center>
	);
};

export default Mainpage;
