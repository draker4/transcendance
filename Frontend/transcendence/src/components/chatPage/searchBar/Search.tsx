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
  createList,
  openDisplay,
  socket,
  setList,
  setError,
}: {
  list: (Channel | Pongie | CreateOne)[];
  error: ListError | null;
  getData: (event: React.MouseEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => void;
  createList: (text: string) => void;
	openDisplay: (display: Display) => void;
  socket: Socket;
  setList: React.Dispatch<React.SetStateAction<(CreateOne | Channel | Pongie)[]>>;
  setError: React.Dispatch<React.SetStateAction<ListError | null>>;
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

      // create channel if id = -1
      if (item.id === -1 && 'name' in item) {
        const name = item.name.slice(15, item.name.length);

        socket.emit("create", name, (payload: {
          success: boolean,
          channel: Channel,
        }) => {
          if (payload.success) {
            openDisplay(payload.channel);
          }
          else {
            setList([]);
            setError({
              id: -1,
              error: true,
              msg: `${name} is private, please choose an other name`,
            });
          }
        });
      }

      // join channel
      if (item.id !== -1 && "joined" in item || "login" in item) {
        socket.emit("join", key);
        openDisplay(item);
      }
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
    createList(event.target.value);
    setDropdownVisible(true);
  };

  return (
    <div className={styles.main}>
      <div className={styles.searchBar} ref={inputRef}>
        <input
          type="text"
          placeholder="Channels, pongies..."
          onClick={getData}
          onChange={handleSearch}
          onFocus={(e) => {
            // getData(e);
            setDropdownVisible(true);
          }}
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
