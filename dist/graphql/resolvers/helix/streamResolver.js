"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    HelixStream: {
        async game(parent) {
            return await parent.getGame();
        },
        async user(parent) {
            return await parent.getUser();
        },
    },
};
//# sourceMappingURL=streamResolver.js.map