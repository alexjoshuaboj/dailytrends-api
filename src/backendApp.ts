import { Server } from './server';

export class BackendApp {
    server?: Server;

    async start(): Promise<void> {
        const port = process.env.PORT ?? '3071';
        this.server = new Server(port);

        return this.server.listen();
    }

    async stop(): Promise<void> {
        return this.server?.stop();
    }
}
