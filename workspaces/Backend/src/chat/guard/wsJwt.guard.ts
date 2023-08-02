/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { CanActivate, Injectable } from "@nestjs/common";
import { verify } from "jsonwebtoken";
import { WsException } from "@nestjs/websockets";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { SocketToken } from "@/utils/typeorm/SocketToken.entity";
import { CryptoService } from "@/utils/crypto/crypto";

@Injectable()
export class WsJwtGuard implements CanActivate {

    constructor(  
        @InjectRepository(SocketToken)
        private readonly socketTokenRepository: Repository<SocketToken>,
        private readonly cryptoService: CryptoService,
    ) {}

    async canActivate(context: any): Promise<boolean> {
        const client = context.switchToWs().getClient();
        const bearerToken = context.args[0].handshake.headers.authorization.split(' ')[1];

        try {
            const payload = verify(bearerToken, process.env.JWT_SECRET, {
                ignoreExpiration: false,
            }) as any;

            console.log(payload.exp - Date.now() / 1000);

            if (payload.exp - Date.now() / 1000 < 900) {
                const   socketTokens = await this.socketTokenRepository.find({
                    where: { userId: payload.sub },
                });
                const   socketToken = await this.findSocketTokenByBearerToken(socketTokens, bearerToken);

                if (!socketToken)
                    throw new Error('token already expired');

                if (!socketToken.deleted) {
                    const   expirationTime = Date.now() + 60 * 1000;
                    socketToken.deleted = new Date(expirationTime);
                    await this.socketTokenRepository.save(socketToken);
                    client.user = { id: payload.sub, login: payload.login };
                    client.emit('refresh');
                    console.log("emit here id=", client.id);
                    setTimeout(() => {
                        this.socketTokenRepository.remove(socketToken);
                    }, 10000);
                    return true;
                }

                if (socketToken.deleted.getDate() > Date.now())
                    throw new Error("token deletion expired");
            }

            client.user = { id: payload.sub, login: payload.login };
            return true;
        } catch (err) {
            console.log(err);
            throw new WsException('invalid token');
        }
    }

    private async findSocketTokenByBearerToken(socketTokens: SocketToken[], bearerToken: string): Promise<SocketToken | undefined> {
        for (const token of socketTokens) {
            const value = await this.cryptoService.decrypt(token.value);
            if (value === bearerToken) {
                return token;
            }
        }
        return undefined;
    }
}
