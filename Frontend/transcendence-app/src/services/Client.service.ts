
class Client {

    private static instance: Client;
    
    private token: string | null = null;
    private code: string | null = null;
    public isLogged: boolean = false;

    constructor(token: string | null = null) {
        if (Client.instance) {
            return Client.instance;
        }
        Client.instance = this;
    }

    // log function with 42 api
    public async logIn42(code: string) {
        const   response = await fetch(`http://backend:4000/api/auth/42/${code}`)
            .then(res => {
                if (res) {
                    const   dataUser = res.json();
                    this.isLogged = true;
                    console.log(dataUser);
                }
            })
            .catch(err => console.log(err));
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

export default Client;
