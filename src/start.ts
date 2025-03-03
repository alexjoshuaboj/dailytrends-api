import { BackendApp } from './backendApp';

try {
	new BackendApp().start();

	console.log('Current NODE_ENV:', process.env.NODE_ENV);
} catch (e) {
	console.log(e);
	process.exit(1);
}

process.on('uncaughtException', err => {
	console.log('uncaughtException', err);
	process.exit(1);
});