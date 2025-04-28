// next-auth.d.ts
declare module "next-auth" {
    interface Session {
      user: {
        id: string;
        role: string;
        email: string | null;
        name: string | null;
        image: string | null;
      }
    }
  
    interface JWT {
      id: string;
      role: string;
    }
  
    interface User {
      id: string;
      name: string;
      email: string | null;
      image: string | null;
      role: string;
    }
  }
  