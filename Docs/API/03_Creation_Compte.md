# API Création de Compte

**[Retour Sommaire API](./00_Sommaire_API.md)**

# Conception

# Liste des EndPoints

<br>

- [01 - api/auth/register](#api-auth-register)

<br>

## Endpoint details
<br>

### `POST api/auth/register` : inscription par email, login, mot de passe <a id="api-auth-register"></a>
<br>

> Requête

  ```
  headers : {
    "Content-Type": "application/json"
  }

  ```
  body : {
    "email": $email,
    "login": $login,
    "password": $password
  }

  ```

> Reponse

  ```

  statusCode : 200,

  ```
<br><br>
