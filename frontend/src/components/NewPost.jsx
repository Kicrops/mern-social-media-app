import { React, useState } from "react";
import { Button } from "../components/ui/button";
import { Field } from "../components/ui/field";
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Flex, Input } from "@chakra-ui/react";

const NewPost = ({ userId }) => {
	const [postObject, setPostObject] = useState({
		title: "",
		description: "",
		image: "",
	});
	const [isPostObjectDialogOpen, setIsPostObjectDialogOpen] = useState(false);

	const handleNewPost = async (e) => {
		e.preventDefault();
		const res = await fetch(`http://localhost:5000/api/posts/${userId}`, {
			method: "POST",
			headers: {
				Authorization: `${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(postObject),
		});
		const { success, data } = await res.json();
		if (success) {
			window.location.href = `/post/${data._id}`;
		}
	};

	return (
		<DialogRoot
			size="md"
			placement="center"
			motionPreset="slide-in-bottom"
			open={isPostObjectDialogOpen}
			onOpenChange={(e) => {
				setIsPostObjectDialogOpen(e.open);
			}}>
			<DialogTrigger asChild>
				<Button variant="ghost" w="100%" fontWeight="500" color="black" cursor="pointer" _hover={{ textDecoration: "underline", backgroundColor: "gray.100" }}>
					New Post
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New Post</DialogTitle>
					<DialogCloseTrigger />
				</DialogHeader>
				<DialogBody>
					<form onSubmit={handleNewPost} style={{ width: "100%", height: "100%" }}>
						<Flex width="100%" height="90%" justifyContent="space-between" alignItems="center" flexDirection="column">
							<Field label="Title">
								<Input placeholder="Title" value={postObject.title} onChange={(e) => setPostObject({ ...postObject, title: e.target.value })} />
							</Field>
							<Field label="Description">
								<Input placeholder="Description" value={postObject.description} onChange={(e) => setPostObject({ ...postObject, description: e.target.value })} />
							</Field>
							<Field label="Image">
								<Input placeholder="Image" value={postObject.image} onChange={(e) => setPostObject({ ...postObject, image: e.target.value })} />
							</Field>
						</Flex>
						<Button bgColor="blue.600" width="100%" mt="6" _hover={{ bgColor: "blue.700" }} type="submit">
							Post
						</Button>
					</form>
				</DialogBody>
			</DialogContent>
		</DialogRoot>
	);
};

export default NewPost;
