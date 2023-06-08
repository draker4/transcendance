import Profile from "@/services/Profile.service"

class Client {

    private static instance: Client;
    
    public  profile = new Profile();
    public  logged = false;
    public  token: string = '';
    public  student42: boolean = false;

    constructor() {
        if (Client.instance) {
            return Client.instance;
        }
        Client.instance = this;
    }

    // log function with 42 api
    public async logIn42(code: string) {
        const   response = await fetch(`http://backend:4000/api/auth/42/${code}`);

        if (!response.ok)
            throw new Error("Connection refused");

        const   {access_token} = await response.json();
        console.log(access_token);
        this.token = access_token;
        this.logged = true;
        this.student42 = true;
    }

    // log function with email and password
    public async logInEmail(email: string, login: string, password: string) {
        
        const   response = await fetch(`http://localhost:4000/api/auth/email`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
                login: login,
                password: password
            }),
        });

        if (!response.ok)
            throw new Error("connexion refused");
        
        const   { access_token } = await response.json();
        this.token = access_token;
        this.logged = true;
    }
}

export default Client;

