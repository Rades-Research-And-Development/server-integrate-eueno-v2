// init server and router
import express from 'express';
import router from './route.js';
import helmet from 'helmet';
import compression from 'compression';

const app = express();

app.use(helmet());
app.use(compression());

app.use(express.json({ limit: '50mb' }));
app.use(router);
// app.use(express.static('images'))
app.use(express.urlencoded({ extended: true }));
app.listen(3000, () => {
  console.log('server is running on port 3000');
});
