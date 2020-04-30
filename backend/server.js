const express = require('express');
const cors = require('cors');
const dotEnv = require('dotenv');
import SERVER from './graphql/schema';
import {connecToDb} from './database/util'

// set env variables
dotEnv.config();

const app = express();

//db connectivity
connecToDb();

// cors
app.use(cors());

// body parser middleware
app.use(express.json());

SERVER.applyMiddleware({
  app,
});

const PORT = process.env.PORT || 3000;

app.use('/', (req, res, next) => {
  res.send({ message: 'Hello 1' });
});

const htppServer =  app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
  console.log(`Graphql Endpoint: ${SERVER.graphqlPath}`);
});
SERVER.installSubscriptionHandlers(htppServer);