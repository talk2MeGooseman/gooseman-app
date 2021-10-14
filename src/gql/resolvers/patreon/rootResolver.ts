import { RequestContext, ArgumentsWithId, IPatreonUser, IInclude } from '../../../interfaces/IGraphql.interface'

export default {
  Query: {
    patreon() {
      return {
        async patrons(_: ArgumentsWithId, context: RequestContext): Promise<any> {
          try {
            const { data: members, included } = await context.patreonClient.getPatrons();

            return members.map((member: any) => {
              const userId = member.relationships.user.data.id

              const user = included.reduce((accum: IPatreonUser, include: IInclude) => {
                if (include.type === 'user' && include.id === userId) {
                  return {
                    id: include.id,
                    ...include.attributes,
                  }
                }

                return accum
              }, undefined)

              return {
                id: member.id,
                ...member.attributes,
                user,
              }
            })
          } catch (error) {
            throw new Error(error.message)
          }
        },
        async me(_: ArgumentsWithId, context: RequestContext): Promise<any> {
          try {
            const { data: user } = await context.patreonClient.me();

            return {
              ...user.attributes,
            }
          } catch (error) {
            throw new Error(error.message)
          }
        }
      }
    },
  },
};

1
