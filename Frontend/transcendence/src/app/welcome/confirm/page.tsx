import { Refresher } from "@/components/refresher/Refresher";
import ConfirmCode from "@/components/welcome/auth/ConfirmCode";

export default function ConfirmPage() {
  console.log("confirm");
  return (
    <div>
      <Refresher />
      <ConfirmCode />
    </div>
  );
}
