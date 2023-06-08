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

  statusCode : 200
  {
      "success": "False",
      "message": "You are already in game"
                 "You are already looking for game"
                 "Catched an error"
  }

  statusCode : 200
  {
      "success": "True",
      "message": "Game created"
      "data" : {
            "game_id" : "eaa44066-1412-4e23-bd61-3e865c18eb48"
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
      "game_id": "eaa44066-1412-4e23-bd61-3e865c18eb48"
      "game_password": "supermotdepasse"
      "join_type": "opponent" | "viewer"
  }
  ```

> Reponse

  ```
  statusCode : 400
  {
      "success": "False",
      "message": "Unautorize",
  }
  
  statusCode : 200
  {
      "success": "False",
      "message": "Game doesn't exist",
                 "Not enough parameters",
                 "Wrong password",
                 "Game already has an opponent",
                 "Game already has 5 viewers",
                 "Game started"
                 "An error occured",
                 "Catched an error"
  }

  statusCode : 200
  {
      "success": "True",
      "message": "Game joined as opponent"
                 "Game joined as viewer"
                 "You are already in this game"
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
  }
  
  statusCode : 200
  {
      "success": "False",
      "message": "Catched an error"
  }

  statusCode : 200
  {
      "success": true,
      "message": "Request successfulld",
      "data": [
          {
              "uuid": "eaa44066-1412-4e23-bd61-3e865c18eb48",
              "Name": "Game_eaa44066-1412-4e23-bd61-3e865c18eb48",
              "Password": "",
              "Host": 1,
              "Opponent": -1,
              "Viewers_List": [],
              "Score_Host": 0,
              "Score_Opponent": 0,
              "Status": "Waiting",
              "CreatedAt": "2023-06-04T16:31:43.292Z",
              "Winner": -1,
              "Loser": -1
          },
          {
              "uuid": "eaa44066-1412-4e23-bd61-3e865c18eb42",
              "Name": "Test",
              "Password": "coucou",
              "Host": 2,
              "Opponent": 1,
              "Viewers_List": [],
              "Score_Host": 0,
              "Score_Opponent": 0,
              "Status": "Waiting",
              "CreatedAt": "2023-06-04T16:31:43.292Z",
              "Winner": -1,
              "Loser": -1
          }
      ]
  }
  ```
<br><br>

### `POST api/games/quit` : quit les partie en cours <a id="api-games-quit"></a>
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
  }
  
  statusCode : 200
  {
      "success": "True",
      "message": "You are not in a game anymore"
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