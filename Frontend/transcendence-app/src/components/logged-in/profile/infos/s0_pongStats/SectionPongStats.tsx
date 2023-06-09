import Profile from "@/services/Profile.service";
import styles from "@/styles/profile/InfoCard.module.css"

type Props = {
  profile: Profile;
}


export default function SectionPongStats({profile} : Props) {

  const crunchyMotto: string = "Give me more paddles, im super-hungry !";
  // const crunchyMotto: string = "";

  const crunchyBio: string = "Hey there! I'm a passionate player of online CrunchyPong. I've spent countless hours honing my skills and mastering the nuances of this game. My ultimate goal is to become the greatest pong cruncher of all time!";
  // const crunchyBio: string = "";


  return (
    <div className={styles.sections}>
      {crunchyMotto !== "" && 
        <div>
          <p className={styles.tinyTitle}>Crunchy motto</p>
          <p>{crunchyMotto}</p>
        </div>
      }
      {crunchyBio !== "" &&
        <div>
          <p className={styles.tinyTitle}>Crunchy story</p>
          <p>{crunchyBio}</p>
        </div>
      }


    </div>
  )
}
