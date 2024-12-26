import { React, useState } from "react";
import { Button } from "../components/ui/button";
import { Field } from "../components/ui/field";
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Flex, Input } from "@chakra-ui/react";

const EditProfile = ({ user }) => {
	const [userObject, setUserObject] = useState({
		firstName: user.firstName,
		lastName: user.lastName,
		username: user.username,
		email: user.email,
		dateOfBirth: user.dateOfBirth,
		location: user.location,
		bio: user.bio,
		profilePicture: user.profilePicture,
	});
	const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);

	const handleEditProfile = async (e) => {
		e.preventDefault();
		const res = await fetch(`http://localhost:5000/api/users/${user._id}`, {
			method: "PUT",
			headers: {
				Authorization: `${localStorage.getItem("token")}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userObject),
		});
		const { success, data } = await res.json();
		if (!success) {
			console.error(error);
		}
		setIsEditProfileDialogOpen(false);
	};

	return (
		<DialogRoot
			size="cover"
			placement="center"
			motionPreset="slide-in-bottom"
			open={isEditProfileDialogOpen}
			onOpenChange={(e) => {
				setIsEditProfileDialogOpen(e.open);
			}}>
			<DialogTrigger asChild>
				<Button bgColor="blue.600" _hover={{ bgColor: "blue.700" }} mt={[4, 0]}>
					Edit Profile
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Profile</DialogTitle>
					<DialogCloseTrigger />
				</DialogHeader>
				<DialogBody>
					<form onSubmit={handleEditProfile} style={{ width: "100%", height: "100%" }}>
						<Flex width="100%" height="90%" justifyContent="space-between" alignItems="center" flexDirection="column">
							<Field label="First name" errorText="First name is required" required>
								<Input placeholder="First name" value={userObject.firstName} onChange={(e) => setUserObject({ ...userObject, firstName: e.target.value })} />
							</Field>
							<Field label="Last name" errorText="Last name is required" required>
								<Input placeholder="Last name" value={userObject.lastName} onChange={(e) => setUserObject({ ...userObject, lastName: e.target.value })} />
							</Field>
							<Field label="Username" errorText="Username is required" required>
								<Input placeholder="Username" value={userObject.username} onChange={(e) => setUserObject({ ...userObject, username: e.target.value })} />
							</Field>
							<Field label="Location">
								<Input placeholder="Location" value={userObject.location} onChange={(e) => setUserObject({ ...userObject, location: e.target.value })} />
							</Field>
							<Field label="Bio">
								<Input placeholder="Bio" value={userObject.bio} onChange={(e) => setUserObject({ ...userObject, bio: e.target.value })} />
							</Field>
							<Field label="Profile Picture">
								<Input placeholder="Profile Picture" value={userObject.profilePicture} onChange={(e) => setUserObject({ ...userObject, profilePicture: e.target.value })} />
							</Field>
						</Flex>
						<Button bgColor="blue.600" width="100%" mt="6" _hover={{ bgColor: "blue.700" }} type="submit">
							Save Changes
						</Button>
					</form>
				</DialogBody>
			</DialogContent>
		</DialogRoot>
	);
};

export default EditProfile;
