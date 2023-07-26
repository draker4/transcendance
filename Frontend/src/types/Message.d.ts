// [!] type temporaire à améliorer
// [?] Avoir 2 types Msg normal et Msg privé ou grouper en un seul ?
type Message = {
    content: string;
    sender: User; // le user emetteur -- garder le type Pongie ??
    date: Date;// date d'emmission ?
    // destination : channel ou pongie ou channel type privateMsg comme backend ?
}
