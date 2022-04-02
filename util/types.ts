import { ServerResponse } from 'http';

export type Context =
  | { session: Session }
  | ({ error: string } & {
      res: ServerResponse;
    });

export type UserInfo = {
  id: number;
  name: string;
  avatar: string;
  bio: string;
};

export type UserActivity = {
  id: number;
  title: string;
};

export type ChatMember = {
  id: number;
  name: string;
  avatar: string;
};

export type Security = {
  email: string;
  pw: string;
  csrfToken: string;
};

export type SecureUser = UserInfo & Security;

export type UserActivityArgs = {
  userId: number;
  activityId: number;
};

export type Chats = { id: number; name: string }[];

export type Chat = {
  id: number;
  name: string;
  userId: number;
};

export type ChatUser = {
  userId: number;
  chatId: number;
};

export type ChatMessage = {
  chatId: number;
  content: string;
  name: string;
};

export type Message = {
  id: number;
  userId: number;
  chatId: number;
  content: string;
  name: string;
};

export type Session = {
  userId: number;
};

export type LoggedInUser = {
  data: {
    logUserIn: {
      id: number | null;
      error: string | null;
    };
  };
};
