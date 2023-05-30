
class Game_Service {

    private static instance: Game_Service;

    constructor() {
        if (Game_Service.instance) {
            return Game_Service.instance;
        }
        Game_Service.instance = this;
    }

    //Fonction de test qui console log un message
    public Test(): void {
        console.log("Game service test");
    }

    //Creer une game avec un nom et un mot de passe
    public async Create_Game(game_password: string, game_name: string): Promise<any> {
        const response = await fetch('api/game/create', {
            method: 'POST',
            body: JSON.stringify({ game_password, game_name }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        return response.json();
    }     
    
    //Recupere la liste de toutes les games en cours
    public async Get_Games(): Promise<any> {

        const response = await fetch('api/games/getall', {
            method: 'GET',
        });
        
        return response.json();
    }

    //Rejoins une partie avec un mot de passe et l'id de la game
    public async Join(game_password: string, game_id: string): Promise<any> {
        const response = await fetch('api/game/join', {
            method: 'POST',
            body: JSON.stringify({ game_password, game_id}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    } 

    //Quite une partie avec l'id de la game
    public async Quit(game_id: string): Promise<any> {
        const response = await fetch('api/game/quit', {
            method: 'POST',
            body: JSON.stringify({ game_id}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    }   


    //Create Game , creer la game et redirige sur la page de la game

    //Liste game , get une liste des game en attente

    //Chercher game, get la liste avec Listegame , puis filtre dessus

    //Randomize, ajoute le client à la liste du matchmake , creer une socket pour attendre la reposne du server si qqn est la aussi

    //Reprendre la partie, repere dans quel partie etait le joueur , et lui renvoi l'id

    //Quitter la partie , supprime le joueur de la bbd de la game
}

const GameService = new Game_Service();
export default GameService;