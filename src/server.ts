import express from 'express';
import routes from '@routes/index';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { DbConnection } from 'infrastructure/dbConnection';

dotenv.config();
export class Server {
    private app: express.Application;
    private port: string;

    constructor(port: string) {
        this.port = port;
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use((_, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });

        this.app.use(helmet.xssFilter());
        this.app.use(helmet.frameguard());
        this.app.use(helmet.hidePoweredBy());
        this.app.use(helmet.ieNoOpen());
        this.app.use(helmet.noSniff());
        this.app.use(helmet.dnsPrefetchControl());

        this.app.get('/isAlive', (_, res) => {
            res.send({
                message: 'Server is alive'
            });
        });

        this.app.use('/api', routes);

        this.app.use((_, res) => {
            res.status(404).send({
                error: 'Not found'
            });
        });
    }

    async initializeDB(): Promise<void> {
        const db = DbConnection.getInstance();
        db.connection;
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