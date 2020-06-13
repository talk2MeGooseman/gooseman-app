"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const krakenChannel = tslib_1.__importStar(require("../krakenChannel"));
const lodash_1 = require("lodash");
exports.default = {
    Query: {
        kraken() {
            return {
                channelById: krakenChannel.byId,
                team: krakenChannel.team,
            };
        },
    },
    KrakenChannel: {
        async teams(parent) {
            return await parent.getTeams();
        },
    },
    KrakenTeam: {
        async liveStreams(parent, _args, context) {
            const users = await parent.getUsers();
            const userIds = users.map((user) => user.id);
            const streams = Promise.all(lodash_1.chunk(userIds, 75).map(async (userIdsChunk) => {
                return await context.twitchClient.kraken.streams.getStreams(userIdsChunk, undefined, undefined, undefined, undefined, 100);
            }));
            return streams.then(lodash_1.flatten);
        },
        async members(parent) {
            return await parent.getUsers();
        },
    },
    KrakenUser: {
        async currentStream(parent) {
            return await parent.getStream();
        },
    },
    KrakenStream: {
        async channel(parent) {
            return parent.channel;
        },
    },
};
//# sourceMappingURL=krakenResolver.js.map