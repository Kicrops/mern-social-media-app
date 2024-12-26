import { Box, Button, Flex, Input, Link } from "@chakra-ui/react";
import { FaHouse, FaMagnifyingGlass } from "react-icons/fa6";
import { Avatar } from "./ui/avatar";
import { useParams } from "react-router-dom";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "./ui/menu";
import NewPost from "./NewPost";
import { React, useState, useEffect } from "react";

const Navbar = () => {
	const { query } = useParams() || "";
	const [user, setUser] = useState(null);
	const [isHovering, setIsHovering] = useState(false);
	const [search, setSearch] = useState(query);
	useEffect(() => {
		const fetchUser = async () => {
			const res = await fetch(`http://localhost:5000/api/users/token`, {
				method: "GET",
				headers: {
					Authorization: `${localStorage.getItem("token")}`,
				},
			});
			const { success, data } = await res.json();
			setUser(data);
		};
		fetchUser();
	}, []);

	if (!user) {
		return;
	}
	return (
		<Box w="100%" h="6vh" bg="gray.200" color="white" display="flex" justifyContent="center" alignItems="center">
			<Flex w="80%" justifyContent="space-between" alignItems="center">
				<Link href="/" size="xl">
					<FaHouse style={{ width: "1.25rem", height: "1.25rem" }} />
				</Link>
				<Box onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
					{isHovering || search ? (
						<Flex alignItems="center" justifyContent="center" gap="2">
							<Input
								placeholder="Search"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										window.location.href = `/search/${search}`;
									}
								}}
								color="black"
								variant="outline"
								w="15"
								border="1px solid black"
							/>
							<Link href={`/search/${search}`}>
								<FaMagnifyingGlass style={{ width: "1.25rem", height: "1.25rem" }} />
							</Link>
						</Flex>
					) : (
						<Link href={`/search/${search}`}>
							<FaMagnifyingGlass style={{ width: "1.25rem", height: "1.25rem" }} />
						</Link>
					)}
				</Box>
				<MenuRoot>
					<MenuTrigger asChild>
						<Avatar src={user.profilePicture} alt="profile picture" size="2xs" shape="full" name={user.firstName + " " + user.lastName} cursor="pointer" />
					</MenuTrigger>
					<MenuContent>
						<MenuItem asChild value="Profile">
							<Link href={`/user/${user._id}`} variant="ghost" w="100%" fontWeight="500" color="black" cursor="pointer" justifyContent="center" _hover={{ textDecoration: "underline", backgroundColor: "gray.100" }}>
								Profile
							</Link>
						</MenuItem>
						<MenuItem asChild value="New Post">
							<NewPost userId={user._id} />
						</MenuItem>
						<MenuItem asChild value="Logout">
							<Button
								onClick={() => {
									localStorage.removeItem("token");
									window.location.href = "/";
								}}
								variant="ghost"
								w="100%"
								fontWeight="500"
								color="red.500"
								cursor="pointer"
								_hover={{ textDecoration: "underline", backgroundColor: "gray.100" }}>
								Logout
							</Button>
						</MenuItem>
					</MenuContent>
				</MenuRoot>
			</Flex>
		</Box>
	);
};

export default Navbar;
