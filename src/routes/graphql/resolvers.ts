
import { MemberType, Post, PrismaClient, Profile } from '@prisma/client';
import DataLoader from 'dataloader';
import { GraphQLResolveInfo } from 'graphql';

export type UserType = {
  id: string,
  name: string,
  balance: number,
}

export const profileResolver = async (
  source: UserType,
  args: object,
  context: {prisma: PrismaClient, dataloaders: WeakMap<object, DataLoader<string, any, string>> },
  info: GraphQLResolveInfo,
): Promise<Profile | null> => {
  const { dataloaders } = context;
  let dl = dataloaders.get(info.fieldNodes);

  if (!dl) {
    dl = new DataLoader(async (ids: readonly string[]) => {
      const profiles = await context.prisma.profile.findMany({
        where: {
          userId: { in: ids as string[] },
        },
      });

      const sortedInIdsOrder = ids.map(id =>
        profiles.find(profile => profile.userId === id),
      );

      return sortedInIdsOrder;
      });
          
    dataloaders.set(info.fieldNodes, dl);
  }

  return dl.load(source.id) as Promise<Profile | null>;
};

export const postsResolver = async (
  source: UserType,
  args: object,
  context: {
        prisma: PrismaClient;
        dataloaders: WeakMap<object, DataLoader<string, any, string>>,
  },
  info: GraphQLResolveInfo
): Promise<Post[] | null> => {
  const { dataloaders } = context;

  let dl = dataloaders.get(info.fieldNodes);

  if (!dl) {
    dl = new DataLoader(async (ids: readonly string[]) => {
      const posts = await context.prisma.post.findMany({
        where: {
          authorId: { in: ids  as string[] },
        },
      });

    const sortedInIdsOrder = ids.map(id =>
      posts.filter(post => post.authorId === id),
    );

    return sortedInIdsOrder;
    });

  dataloaders.set(info.fieldNodes, dl);
  }

  return dl.load(source.id) as Promise<Post[]|[]>;
};

type ProfileType = {
  id: string,
  isMale: boolean,
  yearOfBirth: number,
  userId: string,
  memberTypeId: string,
}

export const memberTypeResolver = async (
  source: ProfileType,
  args: object,
  context: {
        prisma: PrismaClient;
        dataloaders: WeakMap<object, DataLoader<string, any, string>>,
  },
  info: GraphQLResolveInfo
): Promise<MemberType[] | null> => {
  const { dataloaders } = context;

  let dl = dataloaders.get(info.fieldNodes);

  if (!dl) {
    dl = new DataLoader(async (ids: readonly string[]) => {
      const memberTypes = await context.prisma.memberType.findMany({
        where: { id: { in: ids as string[] }},
      });
            
      const sortedInIdsOrder = ids.map(id =>
        memberTypes.find((memberType) => memberType.id === id),
      );
            
    return sortedInIdsOrder;
    });

  dataloaders.set(info.fieldNodes, dl);
  }
  
  return dl.load(source.memberTypeId) as  Promise<MemberType[] | null> ;
};


export const UserSubscribedToResolver = async (
  source: UserType,
  args: object,
  context: {
        prisma: PrismaClient;
        dataloaders: WeakMap<object, DataLoader<string, any, string>>,
  },
  info: GraphQLResolveInfo
): Promise<UserType[] | null> => {
  const { dataloaders } = context;

  let dl = dataloaders.get(info.fieldNodes);

  if (!dl) {
    dl = new DataLoader(async (ids: readonly string[]) => {
      const users = await context.prisma.user.findMany({
        where: { 
          subscribedToUser: { 
            some: {
              subscriberId: {
                in: ids as string[],
              }
            }
          }
        },
        include: { 
          subscribedToUser: true,
        },
        });

        const sortedInIdsOrder = ids.map(id => 
          users.filter(user => 
          user.subscribedToUser.every(subscriber => subscriber.subscriberId === id),
        ));

      return sortedInIdsOrder;
    });

    dataloaders.set(info.fieldNodes, dl);
    } 

  return dl.load(source.id) as  Promise<UserType[] | null> ;
};


export const SubscribedToUserResolver = async (
  source: UserType,
  args: object,
  context: {
        prisma: PrismaClient;
        dataloaders: WeakMap<object, DataLoader<string, any, string>>,
  },
  info: GraphQLResolveInfo
): Promise<UserType[] | null> => {
  const { dataloaders } = context;

  let dl = dataloaders.get(info.fieldNodes);

  if (!dl) {
    dl = new DataLoader(async (ids: readonly string[]) => {
      const users = await context.prisma.user.findMany({
        where: { 
          userSubscribedTo: { 
            some: {
              authorId: {
                in: ids as string[],
              }
            }
          }
        },
        include: { 
          userSubscribedTo: true,
        },
      });

    const sortedInIdsOrder = ids.map(id => 
      users.filter(user => 
        user.userSubscribedTo.some(subscriber => subscriber.authorId === id),
      ));

    return sortedInIdsOrder;
    });

  dataloaders.set(info.fieldNodes, dl);
  }

  return dl.load(source.id) as Promise<UserType[] | null>;
};

