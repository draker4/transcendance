export default async function submitMotto(submitedMotto:string, token:string) {

	try {

		const response = await fetch("http://localhost:4000/api/users/edit", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + token,
			},
			body: JSON.stringify ({
				submitedMotto
			})
		});

		const data = await response.json();
		console.log(data);

		return "";

	} catch(e) {
		console.log(e);
		return "Something wrong / or not allowed words";
	}
}