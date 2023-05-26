# Liste des *Endpoints*
<br>

- [01 - api/game/create](#api-game-create)
- [02 - api/game/join](#api-game-join)
- [03 - api/game/getall](#api-game-getall)
- [04 - api/game/quit](#api-game-quit)
- [05 - api/game/matchmake/start](#api-game-matchmake-start)
- [06 - api/game/matchmake/stop](#api-game-matchmake-stop)
- [06 - api/game/matchmake/update](#api-game-matchmake-update)

<br>

## Game Endpoint details
<br>

### `POST api/game/create` : creer une partie <a id="api-game-create"></a>
<br>

> Requête

  ```
  headers :
  {
      "Crunchy_Token": "$token"
  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "You are not logged in"
  }

  Code : 200
  {
      "success": "True",
      "message": "Game created"
      "data" : {
            "game_id" : "2zfe4f689ze6f4f6z4f468z5ef1z6e84"
      }
  }
  ```
<br><br>

### `POST api/game/join` : rejoins une partie <a id="api-game-join"></a>
<br>

> Requête

  ```
  headers :
  {
      "Crunchy_Token": "$token"
  }

  Body :
  {
      "game_id": "2zfe4f689ze6f4f6z4f468z5ef1z6e84"
  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "You are not logged in",
                 "This game does not exist",
                 "You are not in this game",
                 "The game is full"
  }

  Code : 200
  {
      "success": "True",
      "message": "Game joined"
  }
  ```
<br><br>

### `GET api/game/getall` : recupere la liste des games en cours <a id="api-game-getall"></a>
<br>

> Requête

  ```
  headers :
  {
      "Crunchy_Token": "$token"
  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "You are not logged in",
      "data": ""
  }

  Code : 200
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

### `POST api/game/quit` : quit une partie <a id="api-game-quit"></a>
<br>

> Requête

  ```
  headers :
  {
      "Crunchy_Token": "$token"
  }

  Body :
  {
      "game_id": "2zfe4f689ze6f4f6z4f468z5ef1z6e84"
  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "You are not logged in",
                 "This game does not exist",
                 "You are not in this game",
  }

  Code : 200
  {
      "success": "True",
      "message": "Game left"
  }
  ```
<br><br>

### `POST api/game/matchmake/start` : demare la recherche de partie aleatoire <a id="api-game-matchmake-start"></a>
<br>

> Requête

  ```
  headers :
  {
      "Crunchy_Token": "$token"
  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "You are not logged in",
                 "You are already in game",
                 "You are already looking for game"
  }

  Code : 200
  {
      "success": "True",
      "message": "You are looking for game"
  }
  ```
<br><br>

### `POST api/game/matchmake/stop` : stop la recherche de partie aleatoire <a id="api-game-matchmake-stop"></a>
<br>

> Requête

  ```
  headers :
  {
      "Crunchy_Token": "$token"
  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "You are not logged in",
                 "You are not looking for game"
  }

  Code : 200
  {
      "success": "True",
      "message": "You stopped looking for game"
  }
  ```
<br><br>

### `POST api/game/matchmake/update` : stop la recherche de partie aleatoire <a id="api-game-matchmake-update"></a>
<br>

> Requête

  ```
  headers :
  {
      "Crunchy_Token": "$token"
  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "You are not logged in",
                 "You are not looking for game",
                 "You are already in game"
  }

  Code : 200
  {
      "success": "True",
      "message": "No game found"
      "data": {
            "game_id" : ""
            "player_waiting" : "2"
      }
  }

  Code : 201
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

























<br>

> Requête

  ```
  headers :
  {
      "Authorization": "Bearer $token"
  }

  Body :
  {
      "username": "string"
  }
  ```

> Reponse

  ```
  Code : 400
  {
      "success": "False",
      "message": "Invalid username or password"
                 "Username or password is empty"
                 "Username already exists"
  }

  Code : 200
  {
      "success": "True",
      "message": "Registration successful"
  }
  ```
<br><br>

<a id="api-game-create"></a>

### `GET /api/games/:id` : récupération des informations d'une partie
<br>

> Requête

  ```
  headers :
  {
      "Authorization": "Bearer $token"
  }

  Body :
  {

  }
  ```

> Reponse

  ```
  Code : 404
  {
      "success": "False",
      "message": "Game not found"
  }

  Code : 400
  {
      "success": "False",
      "message": "You are not logged in"
  }

  Code : 200
  {
      "game": 
      {
          "shots": $all_player_shots
          "ships": $player ships
          "state": $state
          "yourturn": $turn
      }
  }
  ```
États de la partie :
- `waiting` : en attente de joueurs
- `playing` : en cours de jeu
- `finished` : partie terminée
<br><br>
