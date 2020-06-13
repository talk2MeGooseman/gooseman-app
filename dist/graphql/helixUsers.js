"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.byId = async (args, context) => {
    let user = await context.twitchClient.helix.users.getUserById(args.id);
    return user;
};
exports.byName = async (args, context) => {
    let user = await context.twitchClient.helix.users.getUserByName(args.name);
    return user;
};
exports.byIds = async (args, context) => {
    let users = await context.twitchClient.helix.users.getUsersByIds(args.ids);
    return users;
};
exports.byNames = async (args, context) => {
    let users = await context.twitchClient.helix.users.getUsersByNames(args.names);
    return users;
};
//# sourceMappingURL=helixUsers.js.map