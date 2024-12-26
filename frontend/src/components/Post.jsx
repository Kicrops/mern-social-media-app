import { Box, Button, Center, HStack, Icon, IconButton, Image, Flex, Spinner, Text, Input, VStack, For, Link } from "@chakra-ui/react";
import { Avatar } from "./ui/avatar";
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Toaster, toaster } from "./ui/toaster";
import { Field } from "./ui/field";
import Comment from "./Comment";
import { HiHeart, HiChatBubbleOvalLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import { React, useState, useEffect } from "react";

const Post = ({ postId, showComments, loggedUserId }) => {
	const [post, setPost] = useState(null);
	const [user, setUser] = useState(null);
	const [liked, setLiked] = useState(false);
	const [comment, setComment] = useState("");
	const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
	const [isEditPostDialogOpen, setIsEditPostDialogOpen] = useState(false);

	useEffect(() => {
		const fetchPost = async () => {
			const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
				method: "GET",
				headers: {
					Authorization: `${localStorage.getItem("token")}`,
				},
			});
			const { success, data } = await res.json();
			setPost(data);
		};
		fetchPost();
	}, [postId]);

	useEffect(() => {
		const fetchUsers = async () => {
			const res = await fetch(`http://localhost:5000/api/users/${post.user}`, {
				method: "GET",
				headers: {
					Authorization: `${localStorage.getItem("token")}`,
				},
			});
			const { success, data } = await res.json();
			setUser(data);
		};
		if (post?.user) {
			fetchUsers();
		}
	}, [post?.user]);

	useEffect(() => {
		const checkLiked = async () => {
			const liked = post.likes.includes(loggedUserId);
			setLiked(liked);
		};
		if (loggedUserId && post) {
			checkLiked();
		}
	}, [loggedUserId, post]);

	const handleLike = async () => {
		const url = `http://localhost:5000/api/posts/${post._id}/${liked ? "unlike" : "like"}`;
		const res = await fetch(url, {
			method: "PUT",
			headers: {
				Authorization: `${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: loggedUserId }),
		});
		const { success, data } = await res.json();
		if (success) {
			setPost(data);
			setLiked(!liked);
		}
	};
	const handleComment = async (e) => {
		e.preventDefault();
		const res = await fetch(`http://localhost:5000/api/posts/${post._id}/comment`, {
			method: "PUT",
			headers: {
				Authorization: `${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: loggedUserId, text: comment }),
		});
		const { success, data } = await res.json();
		if (success) {
			setPost(data);
			setComment("");
			setIsCommentDialogOpen(false);
			toaster.create({
				title: "Success",
				description: "Comment added successfully",
				type: "success",
				duration: 1500,
			});
		}
	};

	const deleteComment = async (commentId) => {
		const res = await fetch(`http://localhost:5000/api/posts/${post._id}/uncomment`, {
			method: "PUT",
			headers: {
				Authorization: `${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id: loggedUserId, commentId }),
		});
		const { success, data } = await res.json();
		if (success) {
			setPost(data);
			toaster.create({
				title: "Success",
				description: "Comment deleted successfully",
				type: "success",
				duration: 1500,
			});
		}
	};

	const handleEditPost = async (e) => {
		e.preventDefault();
		const res = await fetch(`http://localhost:5000/api/posts/${post._id}`, {
			method: "PUT",
			headers: {
				Authorization: `${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(post),
		});
		const { success, data } = await res.json();
		if (success) {
			setPost(data);
			setIsEditPostDialogOpen(false);
			toaster.create({
				title: "Success",
				description: "Post edited successfully",
				type: "success",
				duration: 1500,
			});
		}
	};

	const handleDeletePost = async () => {
		const res = await fetch(`http://localhost:5000/api/posts/${post._id}`, {
			method: "DELETE",
			headers: {
				Authorization: `${localStorage.getItem("token")}`,
			},
		});
		const { success, data } = await res.json();
		if (success) {
			window.location.href = "/";
		}
	};

	if (!post || !user) {
		return (
			<Center height="100vh">
				<Spinner size="xl" />
			</Center>
		);
	}
	return (
		<Box w="100%" bg="gray.50" p="6" rounded="lg" shadow="md" border="1px solid" borderColor="gray.200">
			<Toaster />
			<VStack spacing="4" w="100%">
				<HStack flexDirection={"row"} w="100%" alignItems="center" justifyContent="space-between">
					<Link href={`/user/${user._id}`} w="100%">
						<HStack maxW="70%">
							<Avatar src={user.profilePicture} alt="profile picture" size="xs" shape="full" name={user.firstName + " " + user.lastName} />
							<Text as="h1" w="100%" textAlign={"left"} fontSize="sm" fontWeight="500">
								@{user.username}
							</Text>
						</HStack>
					</Link>
					{post.user === loggedUserId ? (
						<DialogRoot
							size="xl"
							placement="center"
							motionPreset="slide-in-bottom"
							open={isEditPostDialogOpen}
							onOpenChange={(e) => {
								setIsEditPostDialogOpen(e.open);
							}}>
							<DialogTrigger asChild>
								<IconButton size="sm" variant="ghost">
									<Icon
										boxSize={7}
										color="black"
										_hover={{
											transform: "scale(1.1)",
										}}
										transition="all 0.1s ease">
										<HiEllipsisHorizontal />
									</Icon>
								</IconButton>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Edit Post</DialogTitle>
									<DialogCloseTrigger />
								</DialogHeader>
								<DialogBody>
									<form onSubmit={handleEditPost} style={{ width: "100%", height: "100%" }}>
										<Flex width="100%" height="90%" justifyContent="space-between" alignItems="center" flexDirection="column">
											<Field label="Title">
												<Input placeholder="Title" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
											</Field>
											<Field label="Description">
												<Input placeholder="Description" value={post.description} onChange={(e) => setPost({ ...post, description: e.target.value })} />
											</Field>
											<Field label="Image">
												<Input placeholder="Image" value={post.image} onChange={(e) => setPost({ ...post, image: e.target.value })} />
											</Field>
										</Flex>
										<HStack justifyContent="space-around">
											<Button bgColor="red.600" width="40%" mt="6" _hover={{ bgColor: "red.700" }} onClick={handleDeletePost}>
												Delete Post
											</Button>
											<Button bgColor="blue.600" width="40%" mt="6" _hover={{ bgColor: "blue.700" }} type="submit">
												Save Changes
											</Button>
										</HStack>
									</form>
								</DialogBody>
							</DialogContent>
						</DialogRoot>
					) : (
						""
					)}
				</HStack>

				<Image w="100%" aspectRatio="1" objectFit="contain" src={post.image} alt={post.title} rounded="md" border="1px solid" />
				<HStack w="100%" alignItems="flex-start" justifyContent="space-between">
					<Text flex="1" as="h1" textAlign={"left"} wordBreak="break-word" fontSize={{ base: "md", sm: "lg" }} fontWeight="600" mt="1">
						{post.title}
					</Text>
					<HStack alignSelf="flex-start">
						<IconButton size="sm" variant="ghost" onClick={handleLike}>
							<Icon
								boxSize={7}
								color={liked ? "red.500" : "transparent"}
								stroke={liked ? "red.500" : "black"}
								strokeWidth="1"
								_hover={{
									color: liked ? "darkred" : "gray.200",
									transform: "scale(1.1)",
								}}
								transition="all 0.1s ease">
								<HiHeart />
							</Icon>
						</IconButton>
						<DialogRoot
							size="xl"
							placement="center"
							motionPreset="slide-in-bottom"
							open={isCommentDialogOpen}
							onOpenChange={(e) => {
								setIsCommentDialogOpen(e.open);
							}}>
							<DialogTrigger asChild>
								<IconButton size="sm" variant="ghost">
									<Icon
										boxSize={7}
										color="transparent"
										stroke="black"
										strokeWidth="1"
										_hover={{
											color: "gray.200",
											transform: "scale(1.1)",
										}}
										transition="all 0.1s ease">
										<HiChatBubbleOvalLeft />
									</Icon>
								</IconButton>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Add comment</DialogTitle>
									<DialogCloseTrigger />
								</DialogHeader>
								<DialogBody>
									<form style={{ width: "100%", height: "100%" }} onSubmit={handleComment}>
										<Input placeholder="Add a comment" value={comment} onChange={(e) => setComment(e.target.value)} />
										<Button bgColor="blue.600" width="100%" mt="6" _hover={{ bgColor: "blue.700" }} type="submit">
											Comment
										</Button>
									</form>
								</DialogBody>
							</DialogContent>
						</DialogRoot>
					</HStack>
				</HStack>
				<Text as="p" w="100%" textAlign={"left"} fontSize={{ base: "sm", sm: "md" }} wordBreak="break-word" fontWeight="500" mt="1">
					{post.description}
				</Text>
				<Text as="span" w="100%" textAlign={"right"} fontSize="xs" mt="2" color="gray.500">
					{new Date(post.createdAt).toLocaleString()}
				</Text>
				{showComments ? (
					<For each={post.comments}>{(comment) => <Comment key={comment._id} comment={comment} deleteComment={comment.user === loggedUserId || post.user === loggedUserId ? deleteComment : ""} />}</For>
				) : post.comments.length > 0 ? (
					<Link href={`/post/${post._id}`}>
						<Text as="span" w="100%" textAlign={"center"} fontSize="sm" color="gray.500">
							See {post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}
						</Text>
					</Link>
				) : (
					""
				)}
			</VStack>
		</Box>
	);
};

export default Post;
