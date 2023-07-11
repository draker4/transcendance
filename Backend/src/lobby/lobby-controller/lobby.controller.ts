import { Controller,Post,Get,Request} from '@nestjs/common';
import { LobbyService } from '../lobby-service/lobby.service';
import { Public } from 'src/utils/decorators/public.decorator';

@Controller('lobby/')
export class LobbyController {
	constructor(private readonly LobbyService: LobbyService) { }

	// 00 - api/lobby/status Pour test d'api
	@Public()
	@Get('status')
	Status() {
		return 'Working !';
	}

	// 01 - api/lobby/create
	@Post('create')
	CreateGame(@Request() req) {
		return this.LobbyService.CreateGame(req);
	}

	// 02 - api/lobby/join
	@Post('join')
	JoinGame(@Request() req) {
		return this.LobbyService.JoinGame(req);
	}

	// 03 - api/lobby/getall
	@Get('getall')
	GetAll(@Request() req) {
		return this.LobbyService.GetAll(req);
	}

	// 04 - api/lobby/getone
	@Post('getone')
	GetOne(@Request() req) {
		return this.LobbyService.GetOne(req);
	}

	// 04 - api/lobby/quit
	@Post('quit')
	Quit(@Request() req) {
		return this.LobbyService.Quit(req);
	}

	// 05 - api/lobby/isingame
	@Get('isingame')
	IsInGame(@Request() req) {
		return this.LobbyService.IsInGame(req);
	}

	// 06 - api/lobby/GetLeague
	@Get('getleague')
	GetLeague(@Request() req) {
		return this.LobbyService.GetLeague(req);
	}
}
