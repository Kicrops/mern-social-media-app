import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Post from "../components/Post";

const Postpage = () => {
	const { id } = useParams();
	const [loggedUserId, setLoggedUserId] = useState(null);

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

	return <Post postId={id} showComments={true} loggedUserId={loggedUserId} />;
};

export default Postpage;
