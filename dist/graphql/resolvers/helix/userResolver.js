"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    HelixUser: {
        async latestFollowing(parent) {
            const { data } = await parent.getFollows();
            return data.map((follow) => ({
                id: follow.followedUserId,
                displayName: follow.followedUserDisplayName,
                date: follow.followDate,
            }));
        },
        async currentStream(parent) {
            return await parent.getStream();
        },
        async clips(parent, _args, context) {
            const { data: clips } = await context.twitchClient.helix.clips.getClipsForBroadcaster(parent.id);
            return clips;
        },
        async isFollowingUserId(parent, args, context) {
            if (args.userId.length === 0)
                return false;
            return await parent.follows(args.userId);
        },
        async isFollowingUserName(parent, args, context) {
            if (args.userName.length === 0)
                return false;
            const user = await context.twitchClient.helix.users.getUserByName(args.userName);
            return await parent.follows(user.id);
        },
        async videos(parent, args, context) {
            return await context.twitchClient.helix.videos.getVideosByUserPaginated(parent).getAll();
        },
    },
};
//# sourceMappingURL=userResolver.js.map