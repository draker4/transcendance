// [!] type temporaire à améliorer
// [?] Avoir 2 types Msg normal et Msg privé ou grouper en un seul ?
type Message = {
    content: string;
    sender?: User; // le user emetteur -- garder le type Pongie ??
    date: Date;// date d'emmission ?
    isServerNotif: boolean;
    join?: string;
    opponentId?: number;
    // destination : channel ou pongie ou channel type privateMsg comme backend ?
}

type GroupedMsgType = {
    user: Profile & { avatar: Avatar };
    date: Date;
    messages: Message[];
    isServerNotif: boolean;
    join?: string;
};
