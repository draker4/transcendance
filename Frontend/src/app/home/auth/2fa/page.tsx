import { Refresher } from "@/components/refresher/Refresher";
import TwoFactorAuthClient from "@/components/twoFactorAuthPage/TwoFactorAuthClient";
import styles from "@/styles/twoFactorAuth/TwoFactorAuth.module.css";

export default function TwoFactorAuthPage() {

  return (
    <div className={styles.main}>
      <Refresher />
      <TwoFactorAuthClient />
    </div>
  );
}
