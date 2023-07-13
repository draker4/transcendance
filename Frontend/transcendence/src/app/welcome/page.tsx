import { Refresher } from "@/components/refresher/Refresher";
import WelcomeContainer from "@/components/welcome/Welcome";

export default function Home() {
  console.log("welcome");
  return (
    <main>
      <Refresher />
      <WelcomeContainer />
    </main>
  );
}
