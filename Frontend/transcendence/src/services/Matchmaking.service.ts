import { useRouter } from "next/navigation";

class Matchmaking_Service {
	private static instance: Matchmaking_Service;
	private token: string;
	private router = useRouter();
	private searching: boolean = false;

	constructor(token: any) {
		this.token = token;
		if (Matchmaking_Service.instance) {
			return Matchmaking_Service.instance;
		}
		Matchmaking_Service.instance = this;
	}

	//Fait une requette et renvoie la reponse
	public async FetchData(url: string, methode: string, body: any = null) {
		const response = await fetch(
			`http://${process.env.HOST_IP}:4000/api/${url}`,
			{
				method: methode,
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + this.token,
				},
				body: body,
			}
		);

		if (!response.ok) throw new Error("connexion refused");

		return response;
	}

	//Mets le joueur dans la file d'attente
	public async Start_Matchmaking(): Promise<any> {
		const response = await this.FetchData("matchmaking/start ", "POST");
		const data = await response.json();
		this.searching = data.success;
		this.Update_Matchmaking();
		return data.success;
	}

	//Sors le joueur de la file d'attente
	public async Stop_Matchmaking(): Promise<any> {
		const response = await this.FetchData("matchmaking/stop ", "POST");
		const data = await response.json();
		this.searching = false;
		return data.success;
	}

	//Demande si le joueur à trouvé une game
	public async Update_Matchmaking(): Promise<any> {
		const response = await this.FetchData("matchmaking/update ", "GET");
		const data = await response.json();
		if (data.success === true) {
			if (data.message == "Game found") {
				const url = "game/" + data.data.id;
				this.router.push(url);
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

	//Charge une page
	public async Load_Page(url: string): Promise<any> {
		this.router.push(url);
	}
}

export default Matchmaking_Service;
