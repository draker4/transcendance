import { profile } from "../app/types/profile.type";

export default class Client {

    private static instance: Client;
    
    public  isLogged: boolean = false;
    public  profile?: profile;
    private setProfile: ((profile: profile) => void) | null = null;

    constructor() {
        if (Client.instance) {
            return Client.instance;
        }
        Client.instance = this;
    }

    public initialize = async (setProfile : (profile: profile) => void) => {
        this.setProfile = setProfile;
    }

    private isInitialized = () => {
        if (!this.setProfile) {
            return false;
        }
        return true;
    }

    // log function with 42 api
    public async logIn42(code: string) {

        if (!this.isInitialized()) { 
            console.log("User not initialized");
            return ; 
        }

        const   response = await fetch(`/api/auth/42/${code}`);

        if (!response.ok)
            return ;

        const   profile: profile = await response.json();

        this.isLogged = true;
        this.profile = profile;
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

