import { Socket } from "socket.io-client";
import React, { useEffect, useState } from "react";
import Search from "@/components/chatPage/searchBar/Search";

export default function SearchInvite({
  socket,
}: {
  socket: Socket | undefined;
  openDisplay: (display: Display) => void;
}) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [pongies, setPongies] = useState<Pongie[]>([]);
  const [list, setList] = useState<(Channel | Pongie | CreateOne)[]>([]);
  const [error, setError] = useState<ListError | null>(null);
  const [text, setText] = useState<string>("");
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const verifyChannel = (text: string) => {
    if (text.includes("'") || text.includes('"') || text.includes("`"))
      return {
        id: -1,
        error: true,
        msg: "No quotes in the name please",
      };

    return {
      id: -1,
      error: false,
      msg: "",
    };
  };

  const getData = (event: React.MouseEvent<HTMLInputElement>) => {
    socket?.emit("getChannelsProfile", (channels: Channel[]) => {
      setChannels(channels);
    });
    socket?.emit("getPongies", (pongies: Pongie[]) => {
      setPongies(pongies);
    });

    setText(event.currentTarget.value);
  };

  useEffect(() => {
    const createList = (text: string) => {
      let hasChannel: boolean = false;
      setError(null);

      if (!text) {
        setList([]);
        return;
      }

      const textlowerCase: string = text.toLocaleLowerCase();

      let list: (Channel | Pongie | CreateOne)[] = [];
      list = list.concat(
        channels.filter(
          (channel) => channel?.name.toLowerCase().includes(textlowerCase)
        )
      );

      if (channels.find((channel) => channel?.name === text)) hasChannel = true;

      list = list.concat(
        pongies.filter(
          (pongie) => pongie?.login.toLowerCase().includes(textlowerCase)
        )
      );

      if (list.length === 0) {
        const err: ListError = verifyChannel(text);

        if (err.error) {
          setList([]);
          setError(err);
          return;
        }
      }

      setList(list);
    };

    createList(text);
  }, [channels, pongies, text]);

  const handleClick = (item: Display) => {
    setDropdownVisible(false);
    setList([]);
    setError(null);
    // change to define comportement
  };

  return (
    <Search
      list={list}
      error={error}
      getData={getData}
      setText={setText}
      placeholder="Channels, pongies..."
      handleClick={handleClick}
      isDropdownVisible={isDropdownVisible}
      setDropdownVisible={setDropdownVisible}
    />
  );
}
