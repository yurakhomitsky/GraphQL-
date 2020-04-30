import { ApolloServer } from 'apollo-server-express';
import RESOLVERS from './resolvers/index';
import TypeDefs from './typeDefs/index';
import verifyUser from '../helper/context/index';
import Dataloader from 'dataloader';
import * as loaders from '../loaders/index';

// GraphQL: Schema
const SERVER = new ApolloServer({
  typeDefs: TypeDefs,
  resolvers: RESOLVERS,
  playground: {
    endpoint: `http://localhost:4200/graphql`,
  },
  formatError: (error) => {
    return {
      message: error.message
    }
  },
  context: async ({ req, connection }) => {
    const contextObj = {};
    if (req) {
      await verifyUser(req);
      (contextObj.email = req.email),
      (contextObj.loggedInUserId = req.loggedInUserId);
    }
    contextObj.loaders = {
      user: new Dataloader((keys) => loaders.userLoader.batchUsers(keys)),
    };
    return contextObj;
  },
});

// Exports
export default SERVER;
