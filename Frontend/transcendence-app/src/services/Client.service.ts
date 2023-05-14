
class Client {

    private static instance: Client;
    
    private token: string | null = null;

    constructor(token: string | null = null) {
        if (Client.instance) {
            return Client.instance;
        }
        Client.instance = this;
    }



    //Test pour page de test
    public async Register_User(username: string, password: string): Promise<any> {
        const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.json();
    }

}

export default Client;