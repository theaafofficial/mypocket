import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export default NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 180,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        password: { label: "Secure Code", type: "password" },
      },
      authorize: (credentials) => {
        const password = credentials?.password;
        const TodayDate = new Date().getDate();
        const TodayMonth = new Date().getMonth();
        const TodayYear = new Date().getFullYear();
        const firstPart = TodayDate + TodayMonth + TodayYear;
        const secondPart = process.env.SECRET_KEY as string;
        const fullCode = firstPart.toString() + secondPart;
        if (password === fullCode) {
          return { id: 1, name: "Admin" };
        } else {
          return null;
        }
      },
    }),
  ],
 
  jwt: {
    maxAge: 180,
  },

  secret: process.env.NEXTAUTH_SECRET,
});
