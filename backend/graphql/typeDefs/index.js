import TaskTypeDefs from './task';
import UserTypeDefs from './user';
import { gql } from 'apollo-server-express';

const typeDefs = gql`
  scalar Date

  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
  type Subscription {
    _: String
  }
`;
const TypeDefs = [typeDefs, UserTypeDefs, TaskTypeDefs];
export default TypeDefs;
