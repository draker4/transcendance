import { useRouter } from "next/navigation";

type Game_Settings = {
    name       : string;
    push       : boolean;
    score      : 3 | 4 | 5 | 6 | 7 | 8 | 9;
    round      : 1 | 3 | 5 | 7 | 9;
    difficulty : 1 | 2 | 3 | 4 | 5;
    side       : "left" | "right";
    background : string;
    ball       : string;
    paddle     : string;
    type       : string;
    mode       : string;
};

class Lobby_Service {

    private static instance : Lobby_Service;
    private token: string;
    private router = useRouter();
    private searching : boolean = false;
  
    constructor(token: any) {
        this.token = token;
        if (Lobby_Service.instance) {
            return Lobby_Service.instance;
        }
        Lobby_Service.instance = this;
    }
  
    //Fait une requette et renvoie la reponse
    public async FetchData(url : string , methode : string, body : any = null){
        const response = await fetch(`http://${process.env.HOST_IP}:4000/api/${url}`, {
            method: methode,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + this.token
            },
            body : body
        });

        if (!response.ok)
            throw new Error("connexion refused");  
            
        return response;
    }

    //Recupere l'etat du joueur ( in game or not )
    public async IsInGame(): Promise<any> {

        const response = await this.FetchData('games/isingame' , 'GET');
        if (response.status === 200) {

            const data = await response.json();
            if (data.success === true) {
                return data.data.id
            };
            if (data.success === false) {
                return false;
            }
        }
        return false;
    }   

    //Creer une game avec un nom et un mot de passe
    public async Create_Game(Settings: Game_Settings): Promise<any> {
        const body = JSON.stringify(Settings)
        const response = await this.FetchData('games/create' , 'POST', body);
        const data = await response.json();
        if (data.success === false) {
            return false;
        }
        const url = 'game/' + data.data.id;
        this.router.push(url);
    }   
    
    //Reprendre la partie en cours
    public async Resume_Game(gameID : string): Promise<any> {
        const url = 'game/' + gameID;
        this.router.push(url);
    }

    //Quit la partie en cours
    public async Quit_Game(): Promise<any> {
        await this.FetchData('games/quit' , 'POST');
    }

    //Recupere la liste des game en cours
    public async Get_Game_List(): Promise<any> {
        const response = await this.FetchData('games/getall' , 'GET');
        const data = await response.json();
        return data.data;
    }

    //Mets le joueur dans la file d'attente
    public async Start_Matchmaking(): Promise<any> {
        const response = await this.FetchData('games/matchmake/start ' , 'POST');
        const data = await response.json();
        this.searching = data.success;
        this.Update_Matchmaking();
        return data.success;
    }

    //Sors le joueur de la file d'attente
    public async Stop_Matchmaking(): Promise<any> {
        const response = await this.FetchData('games/matchmake/stop ' , 'POST');
        const data = await response.json();
        this.searching = false;
        return data.success;
    }

    //Demande si le joueur à trouvé une game
    public async Update_Matchmaking(): Promise<any> {
        const response = await this.FetchData('games/matchmake/update ' , 'GET');
        const data = await response.json();
        if (data.success === true)
        {
            if (data.message == "Game found"){
                const url = 'game/' + data.data.id;
                this.router.push(url);
                return false;
            }
            if (this.searching === true)
                setTimeout(() => { this.Update_Matchmaking(); }, 1000);

            return true;
        }
        return false;
    }

    //Recupere les stats du lobby ( nombre de joueur en attente , nombre de game en cours , etc...)
    public async Get_Stats(): Promise<any> {
        const response = await this.FetchData('games/lobby' , 'GET');
        const data = await response.json();
        return data.data;
    }

    //Charge une page
    public async Load_Page(url : string): Promise<any> {
        this.router.push(url);
    }

    //Recupere les infos de la game
    public async Get_Game_Info(gameID : String | undefined): Promise<any> {
        const body = JSON.stringify( {game_id : gameID});
        console.log(body);
        const response = await this.FetchData('games/getone', 'POST', body);
        const data = await response.json();
        return data.data;
    }
}

export default Lobby_Service;