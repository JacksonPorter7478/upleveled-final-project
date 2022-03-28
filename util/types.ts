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

export type Security = {
  email: string;
  pw: string;
  csrfToken: string;
};

export type SecureUser = UserInfo & Security;

export type UserActivity = {
  userId: number;
  activityId: number;
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
