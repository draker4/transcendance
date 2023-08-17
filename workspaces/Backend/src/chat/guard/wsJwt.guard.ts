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
                ignoreExpiration: true,
            }) as any;

            if (payload.exp * 1000 >= Date.now() + 4500000) {
                console.log("long time checking guard socket")
                const   socketTokens = await this.socketTokenRepository.find({
                    where: { userId: payload.sub },
                });
                const   socketToken = await this.findSocketTokenByBearerToken(socketTokens, bearerToken);

				// [!] je tente de commenter car trop de decos,
                // [!] A RECOMMENTER SI TROP DE DECOS jai essayé de corriger a tester
                if (!socketToken)
					// console.log("WsJwtGuard, commented throw error : token already expired");
                    throw new Error('token already expired');
            }

            client.user = { id: payload.sub, login: payload.login };
            return true;
        } catch (err) {
            console.log(err.message);
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
