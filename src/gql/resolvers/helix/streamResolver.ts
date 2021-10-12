import { HelixStream } from '@twurple/api';

export default {
  HelixStream: {
    async game(parent: HelixStream) {
      return await parent.getGame()
    },
    async user(parent: HelixStream) {
      return await parent.getUser()
    },
  },
}
