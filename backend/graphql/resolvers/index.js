import TASK from './task';
import USER from './user';
import {GraphQLDateTime} from 'graphql-iso-date';

const customDateScalarResolver = {
    Date: GraphQLDateTime
}

export default [USER, TASK, customDateScalarResolver]