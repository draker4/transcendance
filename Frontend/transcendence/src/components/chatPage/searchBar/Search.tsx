import styles from "@/styles/chatPage/searchBar/SearchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faDoorOpen, faLock, faMagnifyingGlass, faPlus, faSmile, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import React from "react";
import AvatarUser from "../../avatarUser/AvatarUser";
import { Socket } from "socket.io-client";

export default function Search({
  list,
  error,
  getData,
  openDisplay,
  socket,
  setList,
  setError,
  setText,
}: {
  list: (Channel | Pongie | CreateOne)[];
  error: ListError | null;
  getData: (event: React.MouseEvent<HTMLInputElement>) => void;
	openDisplay: (display: Display) => void;
  socket: Socket;
  setList: React.Dispatch<React.SetStateAction<(CreateOne | Channel | Pongie)[]>>;
  setError: React.Dispatch<React.SetStateAction<ListError | null>>;
  setText: React.Dispatch<React.SetStateAction<string>>;
}) {

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !dropdownRef.current?.contains(event.target as Node)
        && !inputRef.current?.contains(event.target as Node)
        && !errorRef.current?.contains(event.target as Node)
      )
        setDropdownVisible(false);
    };

    if (isDropdownVisible) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownVisible]);

  const renderList = list.map((item) => {
    let key: string = item.id.toString();

    if ("type" in item && 
    ((item.type === "private" && !item.joined) || item.type === "privateMsg"))
      return ;

    if ("name" in item)
      key = key.concat(".channel");
    else
      key = key.concat(".pongie");

    const handleClick = () => {
      
      setDropdownVisible(false);
      setList([]);
      setError(null);

      const name = 'joined' in item
                    ? item.name
                    : 'login' in item
                    ? item.login
                    : item.name.slice(15, item.name.length);
              
      const type = 'joined' in item
                    ? item.type
                    : 'login' in item
                    ? "privateMsg"
                    : "public";

      socket.emit("join", {
        id: item.id,
        channelName: name,
        channelType: type,
      }, (payload: {
        success: boolean,
        exists: boolean,
        banned: boolean,
        channel: boolean,
      }) => {
        if (payload.success) {
          openDisplay(payload.channel);
        }
        else if (payload.exists) {
          setError({
            error: true,
            msg: `${name} is private, please choose an other name`,
          });
          setDropdownVisible(true);
        }
        else if (payload.banned) {
          setError({
            error: true,
            msg: `You are banned from ${name}`,
          });
          setDropdownVisible(true);
        }
      });
    }

    const color = 'isFriend' in item
                  ? item.isFriend
                  ? "var(--accent)"
                  : "var(--primary-darker3)"
                  : 'joined' in item
                  ? item.joined
                  ? "var(--accent)"
                  : "var(--primary-darker3)"
                  : "var(--primary-darker3)";

    return (
      <React.Fragment key={key}>
        <li onClick={handleClick}>
          <div className={styles.flex}>
            <div className={styles.avatar}>
              <AvatarUser
                avatar={item.avatar}
                borderSize="2px"
                backgroundColor={item.avatar.backgroundColor}
                borderColor={item.avatar.borderColor}
              />
            </div>
            {
              'type' in item && item.type === "public" &&
              <div className={styles.icons}>
                  <FontAwesomeIcon
                    icon={faDoorOpen}
                    color={color}
                  />
              </div>
            }
            {
              'type' in item && item.type === "protected" &&
              <div className={styles.icons}>
                  <FontAwesomeIcon
                    icon={faLock}
                    color={color}
                  />
              </div>
            }
            {
              'type' in item && item.type === "private" &&
              <div className={styles.icons}>
                  <FontAwesomeIcon
                    icon={faBan}
                    color={color}
                  />
              </div>
            }
            {
              'isFriend' in item &&
              <div className={styles.icons}>
                  <FontAwesomeIcon
                    icon={faSmile}
                    color={color}
                  />
              </div>
            }
            {
              'name' in item && !('joined' in item) &&
              <div className={styles.icons}>
                  <FontAwesomeIcon
                    icon={faPlus}
                    color={color}
                  />
              </div>
            }
            {"name" in item && <div className={styles.name}>{item.name}</div>}
            {"login" in item && <div className={styles.name}>{item.login}</div>}
          </div>
        </li>
      </React.Fragment>
    );
  });

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  return (
    <div className={styles.main}>
      <div className={styles.searchBar} ref={inputRef}>
        <input
          type="text"
          placeholder="Channels, pongies..."
          onClick={(e) => {
            getData(e);
            setDropdownVisible(true);
          }}
          onChange={handleSearch}
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.icon} />
      </div>
      {
        error && isDropdownVisible &&
        <div
          className={styles.dropdown + " " + styles.error}
          ref={errorRef}
        >
          {error.msg}
        </div>
      }
      {
        list.length !== 0 && isDropdownVisible &&
        <div className={styles.dropdown} ref={dropdownRef}>
          <ul>{renderList}</ul>
        </div>
      }
    </div>
  );
}
