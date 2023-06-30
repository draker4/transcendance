export default async function submitStory(submitedStory:string, token:string) {

	try {

		const response = await fetch(`http://${process.env.HOST_IP}:4000/api/users/edit-story`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + token,
			},
			body: JSON.stringify ({
				submitedStory
			})
		});

		const data = await response.json();

		return "";

	} catch(e) {
		console.log(e);
		return "Something wrong / or not allowed words in story";
	}
}
