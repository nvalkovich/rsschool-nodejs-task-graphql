import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLList } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';
import { MemberTypeId } from '../member-types/schemas.js';
import { memberTypeIdEnum, memberTypeObjectType, postObjectType, profileInputType, profileObjectType, userObjectType } from './objectTypes.js';


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
    createProfile: {
      type: profileObjectType,
      args: { 
        profile: {
          type: new GraphQLNonNull(profileInputType)
        }
      },
      resolve: async (_, args: { id: string }, context) => {
        return true;
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
