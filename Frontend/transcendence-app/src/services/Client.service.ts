import { getAuthId } from "@/lib/auth";
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
            return ;

        const   { access_token } = await response.json();
        this.token = access_token;
        this.logged = true;
        this.student42 = true;
    }
}

export default Client;

