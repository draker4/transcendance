
class Client {

    private static instance: Client;
    
    private token: string | null = null;

    constructor(token: string | null = null) {
        if (Client.instance) {
            return Client.instance;
        }
        Client.instance = this;
    }

    //Test pour page de test ( envoi un usernam et un password à /api/registrer et renoie la reponse )
    public async Register_User(username: string, password: string): Promise<any> {

        const response = await fetch('/api/register', {
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

}

export default Client;