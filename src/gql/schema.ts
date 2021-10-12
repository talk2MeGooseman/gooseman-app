import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolvers';
import { GraphQLSchema } from 'graphql';
import typeDefs from './typeDefs'

const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export default schema;
