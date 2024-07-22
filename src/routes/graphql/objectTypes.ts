import { SubscribedToUserResolver, UserSubscribedToResolver, memberTypeResolver, postsResolver, profileResolver } from './resolvers.js';
import { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLEnumType,  GraphQLList, GraphQLFloat, GraphQLString, GraphQLBoolean, GraphQLInputObjectType } from 'graphql';
import { UUIDType } from './types/uuid.js';


export const memberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: "basic" },
    business: {value: "business" },
  },
})


export const memberTypeObjectType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: {
      type: new GraphQLNonNull(memberTypeIdEnum)
    },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt)
    },
  }
})


export const postObjectType = new GraphQLObjectType({
  name: 'PostType',
  fields: {
    id: {
      type: new GraphQLNonNull(UUIDType)
    },
    title: {
      type: new GraphQLNonNull(GraphQLString)
    },
    content: {
      type: new GraphQLNonNull(GraphQLString)
    },
    authorID: {
      type: new GraphQLNonNull(UUIDType)
    },
  }
})

export const profileObjectType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: () => ({
    id: { 
      type: new GraphQLNonNull(UUIDType)
    },
    isMale: { 
      type: new GraphQLNonNull(GraphQLBoolean)
    },
    yearOfBirth: { 
      type: new GraphQLNonNull(GraphQLInt)
    },
    userId: { 
      type: new GraphQLNonNull(UUIDType)
    },
    memberType: {
      type: memberTypeObjectType,
      resolve: memberTypeResolver,
    },
  }) 
});

export const userObjectType: GraphQLObjectType = new GraphQLObjectType({
  name: 'BasicUserType',
  fields: () => ({
    id: { 
      type: new GraphQLNonNull(UUIDType)
    },
    name: { 
      type: new GraphQLNonNull(GraphQLString) 
    },
    balance: { 
      type: new GraphQLNonNull(GraphQLFloat)
    },
    profile:  {
      type: profileObjectType,
      resolve: profileResolver,
    },
    posts:  {
      type: new GraphQLList(postObjectType),
      resolve: postsResolver,
    },
    userSubscribedTo: {   
      type: new GraphQLList(userObjectType),
      resolve:  UserSubscribedToResolver,
    },
    subscribedToUser: { 
      type: new GraphQLList(userObjectType),
      resolve: SubscribedToUserResolver,
    }
  })
})

export const CreateUserType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { 
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  }),
});


export const DeleteUserType = new GraphQLInputObjectType({
  name: 'DeleteUserInput',
  fields: () => ({
      userId: { 
        type: UUIDType,
      },
  }),
});

export const ChangeUserType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { 
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  }),
});

export const CreatePostType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
      title: { 
        type: GraphQLString,
      },
      content: { 
        type: GraphQLString,
      },
      authorId: { 
        type: GraphQLString,
      },
  }),
});

export const DeletePostType = new GraphQLInputObjectType({
  name: 'DeletePostInput',
  fields: () => ({
      postId: { 
        type: UUIDType,
      },
  }),
});

export const ChangePostType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
      title: { 
        type: GraphQLString,
      },
      content: { 
        type: GraphQLString,
      },
  }),
});


export const CreateProfileType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
      isMale: { 
        type: GraphQLBoolean,
      },
      yearOfBirth: { 
        type: GraphQLInt,
      },
      memberTypeId: { 
        type: memberTypeIdEnum,
      },
      userId: { 
        type: GraphQLString,
      },
  }),
});

export const DeleteProfileType = new GraphQLInputObjectType({
  name: 'DeleteProfileInput',
  fields: () => ({
      postId: { 
        type: UUIDType,
      },
  }),
});

export const ChangeProfileType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
   isMale: { 
        type: GraphQLBoolean,
      },
      yearOfBirth: { 
        type: GraphQLInt,
      },
      memberTypeId: { 
        type: memberTypeIdEnum,
      },
  }),
});



