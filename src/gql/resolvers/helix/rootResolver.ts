import { HelixUser } from '@twurple/api';
import { RequestContext, ArgumentsWithIds, ArgumentsWithNames, ArgumentsWithId } from '../../../interfaces/IGraphql.interface';

export default {
  Query: {
    helix() {
      return {
        async me(_args: ArgumentsWithIds, context: RequestContext) {
          return await context.twitchClient.helix.users.getMe()
        },
        async streamsByIds(args: ArgumentsWithIds, context: RequestContext) {
          const streamsPaginator = context.twitchClient.helix.streams.getStreamsPaginated(
            { userId: args.ids, type: 'live' }
          );

          return await streamsPaginator.getAll()
        },
        async streamsByNames(args: ArgumentsWithNames, context: RequestContext) {
          const streamsPaginator = context.twitchClient.helix.streams.getStreamsPaginated(
            { userName: args.names, type: 'live' }
          );
          return await streamsPaginator.getAll()
        },
        async usersByIds (args: ArgumentsWithId , context: RequestContext) {
          let users: HelixUser[] | null = await context.twitchClient.helix.users.getUsersByIds(args.ids);
          return users
        },
        async usersByNames (args: ArgumentsWithId , context: RequestContext) {
          let users: HelixUser[] | null = await context.twitchClient.helix.users.getUsersByNames(args.names);
          return users;
        },
      };
    },
  },
};
