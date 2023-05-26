import Client from '@/services/Client.service';
import styles from "@/styles/Home.module.css"

const	client = new Client();

export default function HomePage() {
  
	// const	{ client } = useClientContext();
  // client.profile.email = "test";

  // const code: string | null = useSearchParams().get('code');
  // const [loading, setLoading] = useState(true);


  // useEffect(() => {
  //   const fetchData = async () => {

  //     if (!client.logged && code) {
  //       console.log("log42");
  //       await client.logIn42(code);
  //     }

  //     setCookie("crunchy-token", client.token);
  //     setLoading(false);
  //   };

  //   fetchData();
  // }, [code]);

  // console.log("here=", client.profile.login);

  // const router = useRouter();
  // router.push("/");

  return (
    <main className={styles.main}>
      <div>
        <div>{ client.profile.id }</div>
        <div>{ client.profile.login }</div>
        <div>{ client.profile.first_name}</div>
        <div>{ client.profile.last_name}</div>
        <div>{ client.profile.email}</div>
        <div>{ client.profile.phone}</div>
        <img src={client.profile.image} className={styles.img}></img>
      </div>
    </main>
  );
}
