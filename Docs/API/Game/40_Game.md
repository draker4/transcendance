# Liste des *Endpoints*
<br>

- [01 - api/games/create](#api-games-create)
- [02 - api/games/join](#api-games-join)
- [03 - api/games/getall](#api-games-getall)
- [04 - api/games/quit](#api-games-quit)
- [05 - api/games/matchmake/start](#api-games-matchmake-start)
- [06 - api/games/matchmake/stop](#api-games-matchmake-stop)
- [06 - api/games/matchmake/update](#api-games-matchmake-update)

<br>

## Game Endpoint details
<br>

### `POST api/games/create` : creer une partie <a id="api-games-create"></a>
<br>

> Requête

  ```
  headers :
  {
      "Authorization": Bearer $token
  }
  ```

> Reponse

  ```
  statusCode : 401
  {
      "success": "False",
      "message": "Unautorize"
  }

  statusCode : 402
  {
      "success": "False",
      "message": "You are already in game"
  }

  statusCode : 403
  {
      "success": "False",
      "message": "You are already looking for game"
  }

  statusCode : 200
  {
      "success": "True",
      "message": "Game created"
      "data" : {
            "game_id" : "2zfe4f689ze6f4f6z4f468z5ef1z6e84"
      }
  }
  ```
<br><br>

### `POST api/games/join` : rejoins une partie <a id="api-games-join"></a>
<br>

> Requête

  ```
  headers :
  {
      "Authorization": Bearer $token
  }

  Body :
  {
      "game_id": "2zfe4f689ze6f4f6z4f468z5ef1z6e84"
      "viewer" : "False"
  }
  ```

> Reponse

  ```
  statusCode : 401
  {
      "success": "False",
      "message": "Unautorize",
                 "This game does not exist",
                 "You are not in this game",
                 "You are already in game",
                 "The game is full"
  }

  statusCode : 200
  {
      "success": "True",
      "message": "Game joined"
  }
  ```
<br><br>

### `GET api/games/getall` : recupere la liste des games en cours <a id="api-games-getall"></a>
<br>

> Requête

  ```
  headers :
  {
      "Authorization": Bearer $token
  }
  ```

> Reponse

  ```
  statusCode : 401
  {
      "success": "False",
      "message": "Unautorize",
      "data": ""
  }

  statusCode : 200
  {
      "success": "True",
      "message": "Request successfull",
      "data": {
            2zfe4f689ze6f4f6z4f468z5ef1z6e84 : {
                "game_name" : "My_Game"
                "password" : "True"
                "hostname" : "tquere"
                "state" : "waiting"
                "oponnent" : ""
                "viewer" : "1"
                "hostname_score" : "42"
            },
            f4ze4fze4h84q64ze68f4ezf4ze84fze : {
                "game_name" : "EasyWin"
                "password" : "false"
                "hostname" : "bperiol"
                "state" : "running"
                "oponnent" : "loumarti"
                "viewer" : "0"
                "hostname_score" : "69"
            },
            4f4ezf7zzefefaze8az7e8azea84eaz : {
                "game_name" : "1vs1"
                "password" : "True"
                "hostname" : "bboisson"
                "state" : "waiting"
                "oponnent" : ""
                "viewer" : "5"
                "hostname_score" : "666"
            }
      }
  }
  ```
<br><br>

### `POST api/games/quit` : quit une partie <a id="api-games-quit"></a>
<br>

> Requête

  ```
  headers :
  {
      "Authorization": Bearer $token
  }

  Body :
  {
      "game_id": "2zfe4f689ze6f4f6z4f468z5ef1z6e84"
  }
  ```

> Reponse

  ```
  statusCode : 401
  {
      "success": "False",
      "message": "Unautorize",
                 "This game does not exist",
                 "You are not in this game",
  }

  statusCode : 200
  {
      "success": "True",
      "message": "Game left"
  }
  ```
<br><br>

### `POST api/games/matchmake/start` : demare la recherche de partie aleatoire <a id="api-games-matchmake-start"></a>
<br>

> Requête

  ```
  headers :
  {
      "Authorization": Bearer $token
  }
  ```

> Reponse

  ```
  statusCode : 401
  {
      "success": "False",
      "message": "Unautorize",
                 "You are already in game",
                 "You are already looking for game"
  }

  statusCode : 200
  {
      "success": "True",
      "message": "You are looking for game"
  }
  ```
<br><br>

### `POST api/games/matchmake/stop` : stop la recherche de partie aleatoire <a id="api-games-matchmake-stop"></a>
<br>

> Requête

  ```
  headers :
  {
      "Authorization": Bearer $token
  }
  ```

> Reponse

  ```
  statusCode : 401
  {
      "success": "False",
      "message": "Unautorize",
                 "You are not looking for game"
  }

  statusCode : 200
  {
      "success": "True",
      "message": "You stopped looking for game"
  }
  ```
<br><br>

### `POST api/games/matchmake/update` : stop la recherche de partie aleatoire <a id="api-games-matchmake-update"></a>
<br>

> Requête

  ```
  headers :
  {
      "Authorization": Bearer $token
  }
  ```

> Reponse

  ```
  statusCode : 401
  {
      "success": "False",
      "message": "Unautorize",
                 "You are not looking for game",
                 "You are already in game"
  }

  statusCode : 200
  {
      "success": "True",
      "message": "No game found"
      "data": {
            "game_id" : ""
            "player_waiting" : "2"
      }
  }

  statusCode : 201
  {
      "success": "True",
      "message": "Game found"
      "data": {
            "game_id" : "2zfe4f689ze6f4f6z4f468z5ef1z6e84"
            "player_waiting" : "5"
      }
  }
  ```
<br><br>