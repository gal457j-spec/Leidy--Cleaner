import http from 'http';
import { Server as SocketServer } from 'socket.io';
declare let server: http.Server | null;
declare let io: SocketServer | null;
declare function startServer(): void;
export { server, startServer, io };
//# sourceMappingURL=main.d.ts.map