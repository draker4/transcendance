import styles from "@/styles/chatPage/searchBar/SearchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import React from "react";
import AvatarUser from "../../avatarUser/AvatarUser";
import { faComment } from "@fortawesome/free-regular-svg-icons";

export default function Search({
  list,
  error,
  getData,
  createList,
  handleBlur,
  handleClick,
  placeHolder,
}: {
  list: (Channel | Pongie | CreateOne)[];
  error: ListError | null;
  getData: (event: React.MouseEvent<HTMLInputElement>) => void;
  createList: (text: string) => void;
  handleBlur: () => void;
  handleClick: (display: Display) => void;
  placeHolder: string;
}) {

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current
        && inputRef.current
        && !dropdownRef.current.contains(event.target as Node)
        && !inputRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
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

    if ("name" in item)
      key = key.concat(" channel");
    else
      key = key.concat(" pongie");

    return (
      <React.Fragment key={key}>
        <li onMouseDown={(e) => {
          e.stopPropagation();
        }} >
          <div className={styles.flex}>
            <div className={styles.avatar}>
              <AvatarUser
                avatar={item.avatar}
                borderSize="2px"
                backgroundColor={item.avatar.backgroundColor}
                borderColor={item.avatar.borderColor}
              />
            </div>
            {"name" in item && <div className={styles.name}>{item.name}</div>}
            {"login" in item && <div className={styles.name}>{item.login}</div>}
          </div>
          <div className={styles.flex}>
            <div className={styles.icons}>
                <FontAwesomeIcon
                  icon={faPlus}
                  // onClick={(event) => confirmDelete(pongie, event)}
                />
            </div>
            <div className={styles.icons}>
                <FontAwesomeIcon
                  icon={faComment}
                  // onClick={(event) => confirmDelete(pongie, event)}
                />
            </div>
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
          placeholder={placeHolder}
          onClick={getData}
          onChange={handleSearch}
          onFocus={() => setDropdownVisible(true)}
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.icon} />
      </div>
      {error && (
        <div className={styles.dropdown + " " + styles.error}>{error.msg}</div>
      )}
      {
        list.length !== 0 && isDropdownVisible &&
        <div className={styles.dropdown} ref={dropdownRef}>
          <ul>{renderList}</ul>
        </div>
      }
    </div>
  );
}
