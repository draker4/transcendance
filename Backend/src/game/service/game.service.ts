import { Injectable } from '@nestjs/common';
import { LobbyService } from 'src/lobby/lobby-service/lobby.service';
import { LobbyUtils } from 'src/lobby/lobby-service/lobbyUtils';
import { GameData } from 'src/utils/types/game.types';

@Injectable()
export class GameService extends LobbyUtils {
  // @InjectRepository(User)
  // private readonly userRepository: Repository<User>;
  // @InjectRepository(Game)
  // private readonly gameRepository: Repository<Game>;
  // private readonly usersService: UsersService;
}
