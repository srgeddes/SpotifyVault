import { withIronSessionApiRoute, withIronSessionSsr, IronSessionOptions } from "iron-session/next";
import { NextApiHandler, GetServerSidePropsContext } from "next";

export const sessionOptions: IronSessionOptions = {
	password: process.env.SESSION_SECRET || "complex_password_at_least_32_characters_long",
	cookieName: "spotify_session",
	cookieOptions: {
		secure: process.env.NODE_ENV === "production",
	},
};

export function withSession(handler: NextApiHandler) {
	return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler: (context: GetServerSidePropsContext) => Promise<any>) {
	return withIronSessionSsr(handler, sessionOptions);
}
