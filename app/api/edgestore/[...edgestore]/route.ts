import { db } from '@/config';
import { ERROR_MESSAGES } from '@/constants';
import { handleError } from '@/utils/handle-error';
import { initEdgeStore } from '@edgestore/server';
import { CreateContextOptions, createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from '@prisma/client';
import * as z from 'zod';

const DEFAULT_MAX_SIZE = 1024 * 1024 * 10; // 10MB

type TAllowedRoles = Exclude<Role, "ADMIN" | "GUEST">;

type Context = {
    id: string;
    profileId: string;
    role: Role;
};

const queryStrategies: {
    [key in TAllowedRoles]: (profileId: string) => Promise<any>;
} = {
    TEACHER: async (profileId: string) => {
        const teacher = await db.teacher.findFirst({
            where: {
                profileId
            }
        });

        if (!teacher) {
            handleError(ERROR_MESSAGES.CLIENT_ERROR.NOT_FOUND.CODE)
        }

        return teacher;
    },
    STUDENT: async (profileId: string) => {
        const student = await db.student.findFirst({
            where: {
                profileId
            }
        });

        if (!student) {
            handleError(ERROR_MESSAGES.CLIENT_ERROR.NOT_FOUND.CODE)
        }

        return student;
    },
    ORGANIZATION: async (profileId: string) => {
        console.log("profileId", profileId)
        const organization = await db.organization.findFirst({
            where: {
                profileId
            }
        });

        if (!organization) {
            handleError(ERROR_MESSAGES.CLIENT_ERROR.NOT_FOUND.CODE)
        }

        return organization;
    }
}

async function createContext({ req }: CreateContextOptions): Promise<Context> {
    const { getUser } = getKindeServerSession()
    const user = await getUser();

    if (!user) {
        console.log("User not found")
        return {
            id: " ",
            profileId: " ",
            role: "GUEST"
        }
    }

    const profile = await db.profile.findUnique({
        where: {
            kindeId: user.id
        }!
    })

    if (!profile) {
        handleError(ERROR_MESSAGES.CLIENT_ERROR.NOT_FOUND.CODE)
    }

    const allowedRoles: TAllowedRoles[] = ["STUDENT", "TEACHER", "ORGANIZATION"];

    if (!allowedRoles.includes(profile!.role as TAllowedRoles)) {
        handleError(ERROR_MESSAGES.CLIENT_ERROR.UNAUTHORIZED.CODE)
    }

    const tenant = await queryStrategies[profile!.role as TAllowedRoles](profile!.kindeId);

    return {
        id: tenant.id,
        profileId: profile!.kindeId,
        role: profile!.role
    }
}

const es = initEdgeStore.context<Context>().create();

/**
* This is the main router for the Edge Store buckets.
*/
const edgeStoreRouter = es.router({
    publicFiles: es.fileBucket({
        maxSize: DEFAULT_MAX_SIZE,
    })
        .input(z.object({
            classroomId: z.string().optional(),
        }))
        .metadata(({ ctx, input }) => ({
            profileId: ctx.profileId,
            userId: ctx.id,
            userRole: ctx.role,
            classroomId: input.classroomId,
        })),
});

const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
    createContext,
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;