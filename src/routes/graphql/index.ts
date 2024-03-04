/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLString, validate, parse } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';
import { MemberTypeId } from '../member-types/schemas.js';
import { ChangePostType, ChangeProfileType, ChangeUserType, CreatePostType, CreateProfileType, CreateUserType, DeletePostType, DeleteProfileType, memberTypeIdEnum, memberTypeObjectType, postObjectType, profileObjectType, userObjectType } from './objectTypes.js';
import depthLimit from 'graphql-depth-limit'

const rootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    memberTypes: {
      type: new GraphQLList(memberTypeObjectType),
      resolve: async (_, _args, context: PrismaClient) => {
        return context.memberType.findMany();
      }
    },
    memberType: {
      type: new GraphQLNonNull(memberTypeObjectType),
      args: {
        id: {
          type: new GraphQLNonNull(memberTypeIdEnum)
        }
      },
      resolve: async (_, args: { id: MemberTypeId }, context) => {
        return context.memberType.findUnique({
          where: {
            id: args.id,
          },
        });
      }
    },
    posts: {
      type: new GraphQLList(postObjectType),
      resolve: async (_, args, context) => {
        return context.post.findMany();
      }
    },
    post: {
      type: postObjectType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType)
        }
      },
      resolve: async (_, args: { id: string }, context) => {
        return context.post.findUnique({
          where: {
            id: args.id,
          },
        });
      }
    }, 
    users: {
      type: new GraphQLList(userObjectType),
      resolve: async (_, args, context) => {
        return context.user.findMany();
      }
    },
    user: {
      type: userObjectType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType)
        }
      },
      resolve: async (_, args: { id: string }, context) => {
        return context.user.findUnique({
          where: {
            id: args.id,
          },
        });
      }
  
    },
    profiles: {
      type: new GraphQLList(profileObjectType),
      resolve: async (_, args, context) => {
        return context.profile.findMany();
      }
    },
    profile: {
      type: profileObjectType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType)
        }
      },
      resolve: async (_, args: { id: string }, context: PrismaClient) => {
        return context.profile.findUnique({
          where: {
            id: args.id,
          },
        });
      }
    },
  }
})




const roootMutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: userObjectType,
      args: {
        dto: {
          type: CreateUserType,
        }
      },
      resolve: async (_, args, context: PrismaClient) => {
        return context.user.create({
          data: args.dto,
        });
      }
    },
     deleteUser: {
      type: GraphQLString,
      args: {
        id: {
          type: UUIDType
        },
        dto: {
          type: DeleteProfileType,
        }
      },
      resolve: async (_, args, context: PrismaClient) => {
      await context.user.delete({
        where: {
          id: args.id,
        },
      });
      return 'UserDeleted'
      }
    },
      changeUser: {
      type: userObjectType,
      args: {
        id: {
          type: UUIDType
        },
        dto: {
          type: ChangeUserType,
        }
      },
      resolve: async (_, args, context: PrismaClient) => {
        return context.user.update({
        where: { 
          id: args.id 
        },
        data: args.dto,
      });
      }
    },
      createPost: {
      type: postObjectType,
      args: {
        dto: {
          type: CreatePostType,
        }
      },
      resolve: async (_, args, context: PrismaClient) => {
        return context.post.create({
          data: args.dto,
        });
      }
    },
    deletePost: {
      type: GraphQLString,
      args: {
        id: {
          type: UUIDType
        },
        dto: {
          type: DeletePostType,
        }
      },
      resolve: async (_, args, context: PrismaClient) => {
        await context.post.delete({
          where: {
            id: args.id,
          },
        });

        return 'Post deleted'
      }
    },
      changePost: {
      type: postObjectType,
      args: {
        id: {
          type: UUIDType
        },
        dto: {
          type: ChangePostType,
        }
      },
      resolve: async (_, args, context: PrismaClient) => {
        return context.post.update({
        where: { 
          id: args.id 
        },
        data: args.dto,
      });
      }
    },
    
      createProfile: {
      type: profileObjectType,
      args: {
        dto: {
          type: CreateProfileType,
        }
      },
      resolve: async (_, args, context: PrismaClient) => {
        return context.profile.create({
          data: args.dto,
        });
      }
    },
    deleteProfile: {
      type: GraphQLString,
      args: {
        id: {
          type: UUIDType
        },
        dto: {
          type: DeleteProfileType,
        }
      },
      resolve: async (_, args, context: PrismaClient) => {
      await context.profile.delete({
        where: {
          id: args.id,
        },
      });
      return 'Profile deleted'
      }
    },
    changeProfile: {
      type: profileObjectType,
      args: {
        id: {
          type: UUIDType
        },
        dto: {
          type: ChangeProfileType,
        }
      },
      resolve: async (_, args, context: PrismaClient) => {
        return context.profile.update({
        where: { 
          id: args.id 
        },
        data: args.dto,
      });
      }
    },
      subscribeTo: {
      type: userObjectType,
      args: {
        userId: {
          type: UUIDType
        },
        authorId: {
          type: UUIDType
        }
      },
      resolve: async (_, args, context: PrismaClient) => {
        return context.user.update({
        where: {
          id: args.userId,
        },
        data: {
          userSubscribedTo: {
            create: {
              authorId: args.authorId,
            },
          },
        },
      });
      }
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: {
          type: UUIDType
        },
        authorId: {
          type: UUIDType
        }
      },
      resolve: async (_, args, context: PrismaClient) => {
        await context.subscribersOnAuthors.delete({
        where: {
          subscriberId_authorId: {
            subscriberId: args.userId,
            authorId: args.authorId,
          },
        },
      });

      return 'Unsubscribe'
      }
    },
  }
})

export const gqlSchema = new GraphQLSchema({
  query: rootQuery,
  mutation: roootMutation,
}) 

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    
    async handler(req) {

    const { query, variables } = req.body;

    const errors = validate(gqlSchema, parse(req.body.query), [depthLimit(5)]);
      if (errors.length > 0) {
        return { 
          errors, 
        };
      }

    const graphql1 = graphql({
        schema: gqlSchema, 
        source: query,
        variableValues: variables,
        contextValue: prisma,
      })

      return graphql1;
    },
  });
};

export default plugin;
