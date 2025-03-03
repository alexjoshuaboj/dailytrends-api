import express from 'express';

export class Server {
    private app: express.Application;
    private port: string;

    constructor(port: string) {
        this.port = port;
        this.app = express();
    }

    async listen(): Promise<void> {
        return new Promise((resolve, _) => {
            this.app.listen(this.port, () => {
                console.log(`Server started on port ${this.port}`);
                resolve();
            });
        });
    }

    async stop(): Promise<void> {
		return new Promise((resolve, reject) => {
			this.app.close(err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
		});
	}
}