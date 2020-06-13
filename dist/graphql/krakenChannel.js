"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.byId = async ({ id }, context) => {
    return await context.twitchClient.kraken.channels.getChannel(id);
};
exports.channelTeams = async ({ id }, context) => {
    return await context.twitchClient.kraken.channels.getChannelTeams(id);
};
exports.team = async ({ name }, context) => {
    return await context.twitchClient.kraken.teams.getTeamByName(name);
};
//# sourceMappingURL=krakenChannel.js.map