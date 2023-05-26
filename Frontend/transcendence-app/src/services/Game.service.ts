
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

    //Fonction Create_Game qui 

    //Create Game , creer la game et redirige sur la page de la game

    //Liste game , get une liste des game en attente

    //Chercher game, get la liste avec Listegame , puis filtre dessus

    //Randomize, ajoute le client à la liste du matchmake , creer une socket pour attendre la reposne du server si qqn est la aussi

    //Reprendre la partie, repere dans quel partie etait le joueur , et lui renvoi l'id

    //Quitter la partie , supprime le joueur de la bbd de la game


    

    //Test pour page de test ( envoi un username et un password à /api/registrer et renoie la reponse )
    // public async Register_User(username: string, password: string): Promise<any> {

    //     const response = await fetch('api/users/add', {
    //         method: 'POST',
    //         body: JSON.stringify({ username, password }),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     });
        
    //     if (!response.ok) {
    //         return Promise.reject(response);
    //     }
        
    //     return response.json();
    // }

    //Test pour page de test ( envoi un usernam et un password à /api/registrer et renoie la reponse )
    // public async Get_All_User(): Promise<any> {

    //     const response = await fetch('api/users/getall', {
    //         method: 'GET',
    //     });
        
    //     return response.json();
    // }
}

const GameService = new Game_Service();
export default GameService;