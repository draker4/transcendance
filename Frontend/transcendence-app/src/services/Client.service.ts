
class Client {

    private static instance: Client;
    
    private token: string | null = null;

    constructor(token: string | null = null) {
        if (Client.instance) {
            return Client.instance;
        }
        Client.instance = this;
    }

}

export default Client;