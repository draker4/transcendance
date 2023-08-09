import fetchData from "@/lib/fetch/fetchData";

class Matchmaking_Service {
	private searching: boolean = false;
	private token?: string;

	constructor(token?: string) {
		if (token) this.token = token;
	}

	//Mets le joueur dans la file d'attente
	public async Start_Matchmaking(type: string): Promise<any> {
		const body = JSON.stringify({ type });
		const response = await fetchData(
			this.token,
			"matchmaking",
			"start ",
			"POST",
			body
		);
		const data = await response.json();
		this.searching = data.success;
		this.Update_Matchmaking();
		return data.success;
	}

	//Sors le joueur de la file d'attente
	public async Stop_Matchmaking(): Promise<any> {
		const response = await fetchData(
			this.token,
			"matchmaking",
			"stop ",
			"POST"
		);
		const data = await response.json();
		this.searching = false;
		return data.success;
	}

	//Demande si le joueur à trouvé une game
	public async Update_Matchmaking(): Promise<any> {
		const response = await fetchData(
			this.token,
			"matchmaking",
			"update ",
			"GET"
		);
		const data = await response.json();
		if (data.success === true) {
			if (data.message == "Game found") {
				return false;
			}
			if (this.searching === true)
				setTimeout(() => {
					this.Update_Matchmaking();
				}, 1000);

			return true;
		}
		return false;
	}
}

export default Matchmaking_Service;
