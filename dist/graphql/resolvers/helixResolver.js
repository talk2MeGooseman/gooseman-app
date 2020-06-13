"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const helixUsers = tslib_1.__importStar(require("../helixUsers"));
const twitch_1 = require("twitch");
exports.default = {
    Query: {
        helix() {
            return {
                usersByIds: helixUsers.byIds,
                usersByNames: helixUsers.byNames,
                async streamsByIds(args, context) {
                    const streamsPaginator = context.twitchClient.helix.streams.getStreamsPaginated({ userId: args.ids, type: twitch_1.HelixStreamType.Live });
                    return await streamsPaginator.getAll();
                },
                async streamsByNames(args, context) {
                    const streamsPaginator = context.twitchClient.helix.streams.getStreamsPaginated({ userName: args.names, type: twitch_1.HelixStreamType.Live });
                    return await streamsPaginator.getAll();
                },
            };
        },
    },
};
//# sourceMappingURL=helixResolver.js.map