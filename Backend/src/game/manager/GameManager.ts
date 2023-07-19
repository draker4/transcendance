import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from 'src/utils/types/game.types';
import { Party } from '../party/Party';
import { LobbyService } from 'src/lobby/lobby-service/lobby.service';

export class GameManager {
  // -----------------------------------  VARIABLE  ----------------------------------- //
  private readonly lobbies: Map<Party['uuid'], Party> = new Map<
    Party['uuid'],
    Party
  >();
  private readonly lobbyService: LobbyService;

  // ----------------------------------  CONSTRUCTOR  --------------------------------- //

  constructor(private readonly server: Server) {}

  // -----------------------------------  METHODS  ------------------------------------ //

  public initializeSocket(user: AuthenticatedSocket): void {
    user.data.party = null;
  }

  public terminateSocket(user: AuthenticatedSocket): void {
    user.data.party?.removeClient(user);
  }

  private async createParty(partyId: Party['uuid']): Promise<void> {
    const party = new Party(this.server, partyId);
    this.lobbies.set(partyId, party);
  }

  public joinParty(partyId: Party['uuid'], client: AuthenticatedSocket): void {
    const party = this.lobbies.get(partyId);

    if (!party) {
      this.createParty(partyId);
    }
  }

  // public deleteParty(partyId: Party['uuid']): void {}
}
