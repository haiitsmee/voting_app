import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"];
  }
  interface User {
    role?: string;
  }
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}