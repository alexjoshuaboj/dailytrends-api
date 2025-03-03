import mongoose from 'mongoose';

export class DbConnection {
    private static instance: DbConnection;
    private dbConnection: mongoose.Connection;

    public static getInstance(): DbConnection {
        if (!DbConnection.instance) {
            DbConnection.instance = new DbConnection();
        }
        return DbConnection.instance;
    }

    public connect(): void {
        const uri = process.env.DB_URI || '';
        mongoose.connect(uri);
        this.dbConnection = mongoose.connection;
        this.dbConnection.on('error', console.error.bind(console, 'connection error:'));
        this.dbConnection.once('open', () => {
            console.log('Connected to database');
        });
    }
}