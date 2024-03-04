import { MemberType, Post, PrismaClient, Profile } from '@prisma/client';

export type UserType = {
  id: string,
  name: string,
  balance: number,
}

export const profileResolver = async (
  source: UserType,
  args: object,
  context: PrismaClient,
): Promise<Profile | null> => {
  return await context.profile.findUnique({
    where: {
      userId: source.id,
    },
  });
};

export const postsResolver = async (
  source: UserType,
  args: object,
  context: PrismaClient,
): Promise<Post[] | null> => {
  return await context.post.findMany({
      where: {
        authorId: source.id,
      },
  });
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
  context: PrismaClient,
): Promise<MemberType | null> => {
  return context.memberType.findUnique({
    where: {
      id: source.memberTypeId
    },
  });
};

export const UserSubscribedToResolver = async (
  source: UserType,
  args: object,
  context: PrismaClient,
): Promise<UserType[] | null> => {
  return context.user.findMany({
    where: {
      subscribedToUser: {
        some: {
          subscriberId: source.id,
        },
      },
    },
  });
};


export const SubscribedToUserResolver = async (
  source: UserType,
  args: object,
  context: PrismaClient,
): Promise<UserType[] | null> => {
 return context.user.findMany({
    where: {
      userSubscribedTo: {
        some: {
          authorId: source.id,
        },
      },
    },
  });
};
