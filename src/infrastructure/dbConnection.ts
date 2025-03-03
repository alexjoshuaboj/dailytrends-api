import mongoose from 'mongoose';

export class DbConnection {
    private static instance: DbConnection;
    private dbConnection: mongoose.Connection;

    private constructor() {
        this.connect();
    }

    public static getInstance(): DbConnection {
        if (!DbConnection.instance) {
            DbConnection.instance = new DbConnection();
        }
        return DbConnection.instance;
    }

    private connect(): void {
        const uri = process.env.MONGO_URI || '';
        mongoose.connect(uri);
        this.dbConnection = mongoose.connection;
        this.dbConnection.on('error', console.error.bind(console, 'connection error:'));
        this.dbConnection.once('open', () => {
            console.log('Connected to database');
        });
    }

    public close(): void {
        this.dbConnection.close();
    }

    public get connection(): mongoose.Connection {
        return this.dbConnection;
    }

    public set connection(connection: mongoose.Connection) {
        this.dbConnection = connection;
    }
}