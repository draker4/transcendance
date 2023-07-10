# Liste des *Endpoints*
<br>

- [00 - api/lobby/status](#api-lobby-matchmake-status)
- [01 - api/lobby/create](#api-lobby-create)
- [02 - api/lobby/join](#api-lobby-join)
- [03 - api/lobby/getall](#api-lobby-getall)
- [04 - api/lobby/getone](#api-lobby-getone)
- [05 - api/lobby/quit](#api-lobby-quit)
- [06 - api/lobby/isingame](#api-lobby-isingame)

<br>

## Game Endpoint details
<br>

### `GET api/lobby/status` : test si le service est en ligne <a id="api-lobby-status"></a>
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
  statusCode : 200
  {
      "Working !"
  }
  ```
<br><br>

### `POST api/lobby/create` : creer une partie <a id="api-lobby-create"></a>
<br>

> Requête

  ```
  headers :
  {
      "Authorization": Bearer $token
  }
  Body :
  {
    "name"          : "1vs1_Octogone",
    "push"          : "True",
    "score"         : "3",
    "round"         : "3",
    "side"          : "left",
    "background"    : "back_1",
    "ball"          : "ball_2",
    "type"          : "Ranked",
    "mode"          : "Classic",
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
                 "You are already in matchmaking"
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

### `POST api/lobby/join` : rejoins une partie <a id="api-lobby-join"></a>
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
                 "Game already has an opponent",
                 "An error occured",
                 "Catched an error"
  }

  statusCode : 200
  {
      "success": "True",
      "message": "Game joined as opponent"
                 "You are already in this game"
  }
  ```
<br><br>

### `GET api/lobby/getall` : recupere la liste des games en cours ( waiting / inprogress ) <a id="api-lobby-getall"></a>
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
                "uuid": "9c390a2b-b287-4b91-9703-b903572fa597",
                "Name": "",
                "Host": "dadad",
                "Opponent": "Player_-1",
                "Viewers_List": 0,
                "Score_Host": 0,
                "Score_Opponent": 0,
                "Status": "Waiting",
                "CreatedAt": "2023-07-08T11:15:19.549Z",
                "Winner": -1,
                "Loser": -1,
                "Score": 3,
                "Push": false,
                "Round": 3,
                "Side": "left",
                "Background": "background/0",
                "Ball": "ball/0",
                "Type": "classic"
            },
            {
                "uuid": "9c390a2b-b287-4b91-9703-b903572fa597",
                "Name": "",
                "Host": "dadad",
                "Opponent": "Player_-1",
                "Viewers_List": 0,
                "Score_Host": 0,
                "Score_Opponent": 0,
                "Status": "Waiting",
                "CreatedAt": "2023-07-08T11:15:19.549Z",
                "Winner": -1,
                "Loser": -1,
                "Score": 3,
                "Push": false,
                "Round": 3,

                "Side": "left",
                "Background": "background/0",
                "Ball": "ball/0",
                "Type": "classic"
            }
        ]
  }
  ```
<br><br>

### `POST api/lobby/quit` : quit les partie en cours <a id="api-lobby-quit"></a>
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
      "success": "false",
      "message": "You are not in a game"
  }
  
  statusCode : 200
  {
      "success": "True",
      "message": "You have been removed from all game"
  }
  ```
<br><br>


### `GET api/lobby/isingame` : Si le joueur est dans une game , renvoi son id <a id="api-lobby-matchmake-isingame"></a>
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
      "message": "You are not in game"
  }

  statusCode : 200
  {
      "success": "True",
      "message": "You are in game"
      "data"   : {
            id : $game_id
      }
  }
  ```
<br><br>






