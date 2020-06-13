"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    HelixSubscription: {
        async broadcaster(parent) {
            return await parent.getBroadcaster();
        },
        async user(parent) {
            return await parent.getUser();
        },
    }
};
//# sourceMappingURL=subscriptionResolver.js.map