

	//Ajoute le joueur dans la game en temps que viewer
	// async AddViewerToGame(game_id: string, user_id: number): Promise<any> {
	// 	if (game_id != null) {
	// 		//Check si c'est un uuid
	// 		if (game_id.length != 36) {
	// 			return false;
	// 		}

	// 		//Check si le joueur est deja dans la game
	// 		if (await this.CheckIfPlayerIsAlreadyInThisGame(game_id, user_id)) {
	// 			return false;
	// 		}

	// 		const game = await this.GameRepository.findOne({
	// 			where: { uuid: game_id },
	// 		});
	// 		if (game != null) {
	// 			game.Viewers_List.push(user_id);
	// 			await this.GameRepository.save(game);
	// 			return true;
	// 		}
	// 	}
	// 	return false;
	// }


	//Check si la partie a deja 5 viewers
	// async CheckIfGameHas5Viewers(game_id: string): Promise<any> {

	// 	if (game_id != null) {

	// 		//Check si c'est un uuid
	// 		if (game_id.length != 36) {
	// 			return false;
	// 		}

	// 		const game = await this.GameRepository.findOne({
	// 			where: { uuid: game_id },
	// 		});
	// 		if (game != null) {
	// 			if (game.Viewers_List.length >= 5) {
	// 				return true;
	// 			}
	// 		}
	// 	}
	// 	return false;
	// }