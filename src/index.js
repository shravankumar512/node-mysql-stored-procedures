import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routers from './routers'

const app = express();

app.set('HEALTH_STATUS', 'INITIALIZING SERVICE');
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())
app.use(cors())

app.use((req, res, next) => {
    res.set('Content-Type', 'application/json');
    next();
});

// Add The Routes
routers(app);

app.set('HEALTH_STATUS', 'READY');

let server = null
new Promise((resolve, reject) => {
    server = app.listen(3000, '0.0.0.0', error => {
        if (error) {
            server = null
            reject(error);
            return;
        }
        console.log('server start on port: 3000')
        resolve();
    });
});

process.on('SIGTERM', () => {
    app.set('HEALTH_STATUS', 'SHUTTING_DOWN');
    setTimeout(() => {
        server.close(() => {
            console.log('Shutdown Complete.');
            process.exit(0);
        });
    }, 3000);
});

