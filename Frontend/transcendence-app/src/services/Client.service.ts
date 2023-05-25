import Profile from "@/services/Profile.service"

export default class Client {

    private static instance: Client;
    
    public  profile = new Profile();
    public  logged = false;
    public  token: string = '';

    constructor() {
        if (Client.instance) {
            return Client.instance;
        }
        Client.instance = this;
    }

    // log function with 42 api
    public async logIn42(code: string) {

        const   response = await fetch(`/api/auth/42/${code}`);

        if (!response.ok)
            return ;

        const   {user, access_token} = await response.json();
        this.profile = user;
        this.token = access_token;
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

