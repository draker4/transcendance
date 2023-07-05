import styles from "@/styles/chatPage/searchBar/SearchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent } from "react";
import React from "react";
import AvatarUser from "../../avatarUser/AvatarUser";

export default function Search({
  list,
  error,
  getData,
  createList,
  handleBlur,
  handleClick,
}: {
  list: (Channel | Pongie | CreateOne)[];
  error: ListError | null;
  getData: (event: React.MouseEvent<HTMLInputElement>) => void;
  createList: (text: string) => void;
  handleBlur: () => void;
  handleClick: (display: Display) => void;
}) {

  const renderList = list.map((item) => {
    let key: string = item.id.toString();

    if ("name" in item)
      key = key.concat(" channel");
    else
      key = key.concat(" pongie");

    return (
      <React.Fragment key={key}>
        <li onMouseDown={() => handleClick(item)}>
          <div className={styles.avatar}>
            <AvatarUser
              avatar={item.avatar}
              borderSize="1px"
              backgroundColor={item.avatar.backgroundColor}
              borderColor={item.avatar.borderColor}
            />
          </div>
          {"name" in item && <div className={styles.name}>{item.name}</div>}
          {"login" in item && <div className={styles.name}>{item.login}</div>}
        </li>
      </React.Fragment>
    );
  });

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    createList(event.target.value);
  };

  return (
    <div className={styles.main} onBlur={handleBlur}>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search"
          onClick={getData}
          onChange={handleSearch}
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.icon} />
      </div>
      {error && (
        <div className={styles.dropdown + " " + styles.error}>{error.msg}</div>
      )}
      {list.length !== 0 && (
        <div className={styles.dropdown}>
          <ul>{renderList}</ul>
        </div>
      )}
    </div>
  );
}
