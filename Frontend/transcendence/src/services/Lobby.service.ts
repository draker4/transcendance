import { useRouter } from "next/navigation";

class Lobby_Service {

	private static instance: Lobby_Service;
	private token: string;
	private router = useRouter();

	constructor(token: any) {
		this.token = token;
		if (Lobby_Service.instance) {
			return Lobby_Service.instance;
		}
		Lobby_Service.instance = this;
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

	//Recupere l'etat du joueur ( in game or not )
	public async IsInGame(): Promise<any> {
		const response = await this.FetchData("lobby/isingame", "GET");
		if (response.status === 200) {
			const data = await response.json();
			if (data.success === true) {
				return data.data.id;
			}
			if (data.success === false) {
				return false;
			}
		}
		return false;
	}

	//Creer une game avec un nom et un mot de passe
	public async Create_Game(Settings: Game_Settings): Promise<any> {
		const body = JSON.stringify(Settings);
		const response = await this.FetchData("lobby/create", "POST", body);
		const data = await response.json();
		if (data.success === false) {
			return false;
		}
		const url = "home/game/" + data.data.id;
		this.router.push(url);
	}

	//Reprendre la partie en cours
	public async Resume_Game(gameID: string): Promise<any> {
		const url = "home/game/" + gameID;
		this.router.push(url);
	}

	//Quit la partie en cours
	public async Quit_Game(): Promise<any> {
		await this.FetchData("lobby/quit", "POST");
	}

	//Recupere la liste des game en cours
	public async Get_Game_List(): Promise<any> {
		const response = await this.FetchData("lobby/getall", "GET");
		const data = await response.json();
		return data.data;
	}

	//Charge une page
	public async Load_Page(url: string): Promise<any> {
		this.router.push(url);
	}

	//Recupere les infos de la game
	public async Get_Game_Info(gameID: String | undefined): Promise<any> {
		const body = JSON.stringify({ game_id: gameID });
		const response = await this.FetchData("lobby/getone", "POST", body);
		const data = await response.json();
		return data.data;
	}

	//Get league data
	public async Get_League(): Promise<any> {
		const response = await this.FetchData("lobby/getleague", "GET");
		const data = await response.json();
		return data.data;
	}

}

export default Lobby_Service;
