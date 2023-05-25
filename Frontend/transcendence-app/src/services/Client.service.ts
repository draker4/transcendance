import Profile from "@/services/Profile.service"

export default class Client {

    private static instance: Client;
    
    // public  isLogged: boolean = false;
    public profile = new Profile();
    public logged = false;

    // private setProfile: ((profile: profile) => void) | null = null;
    // private setIsLogged: ((logged: boolean) => void) | null = null;

    constructor() {
        if (Client.instance) {
            return Client.instance;
        }
        Client.instance = this;
    }

    // public initialize = async (setIsLogged : (logged: boolean) => void) => {
    //     this.setIsLogged = setIsLogged;
    // }

    // private isInitialized = () => {
    //     if (!this.setIsLogged) {
    //         return false;
    //     }
    //     return true;
    // }

    // log function with 42 api
    public async logIn42(code: string){//, setLogged : (logged: boolean) => void) {

        const   response = await fetch(`/api/auth/42/${code}`);

        if (!response.ok)
            return ;

        const   res_json = await response.json();
        this.profile = { ...res_json };
        // console.log(this.profile);
        // console.log(this.profile);
        // this.isLogged = true;
        // this.profile = profile;
        // setLogged(true);
        this.logged = true;
    }

    //Test pour page de test ( envoi un username et un password à /api/registrer et renoie la reponse )
    public async Register_User(username: string, password: string): Promise<any> {

        const response = await fetch('api/users/add', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            return Promise.reject(response);
        }
        
        return response.json();
    }

    //Test pour page de test ( envoi un usernam et un password à /api/registrer et renoie la reponse )
    public async Get_All_User(): Promise<any> {

        const response = await fetch('api/users/getall', {
            method: 'GET',
        });
        
        return response.json();
    }
}

