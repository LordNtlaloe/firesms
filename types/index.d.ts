
export type Session = {
    user: {
        id: string;
        email: string;
        name: string;
        role: "user" | "admin";
    };
    session: any;
};