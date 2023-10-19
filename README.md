# Transcendence

Last project of the 42 cursus, Transcendance is a one page site created with Next.js for the Frontend and NestJS for the backend.

Three containers are running in Docker, one for the backend, one for the frontend and one for the PostgreSql Database. On our website, you can authenticate with an email and password or withe the 42 API or Google API, authorization tokens are given to the front in the cookies in HttpOnly and SameSite Strict in order to have more security. Double authentication is possible, and all user data is crypted or hashed!

This is a real time web app where users can chat in private messages or together in channels (public, protected by password, private, with operators and channel masters...), and play to a beautiful Pong Game, for training or for competition against each other.

Everything is handled with websockets from socket.io, routes are secured by middlewares both in the front or the backend, of course a refresh token cycle is implemented (if the refresh token is used, an other is generated in case that if it is stolen by someone, the next refresh will fail).
