// [!] type temporaire à améliorer
// [?] Avoir 2 types Msg normal et Msg privé ou grouper en un seul ?
type PrivateMsgType = {
    content: string;
    sender: Pongie; // le user emetteur
    date: Date;// date d'emmission ?
    // destination : channel ou pongie ou channel type privateMsg comme backend ?
  }
  