// init server and router 
const express = require('express')
const router = require('./router')
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const app = express()
app.use(router)
    app.use(helmet());
  app.use(compression());
  app.use(rateLimit({ max: 1000, windowMs: 15 * 60 * 1000 }));

  app.enableCors();
  app.use(express.json({ limit: "50mb" }));
app.listen(3000, () => {
    console.log('server is running on port 3000')
}
)
