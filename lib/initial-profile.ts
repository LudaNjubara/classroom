import { db } from "@/config"
import { ERROR_MESSAGES } from "@/constants/error-constants"
import { handleError } from "@/utils/handle-error"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

export const initialProfile = async () => {
    const { getUser, isAuthenticated } = getKindeServerSession()

    if (!isAuthenticated()) {
        handleError(ERROR_MESSAGES.CLIENT_ERROR.UNAUTHORIZED.CODE)
    }

    const user = await getUser()

    if (!user) {
        handleError(ERROR_MESSAGES.CLIENT_ERROR.NOT_FOUND.CODE)
    }

    const profile = await db.profile.findUnique({
        where: {
            kindeId: user!.id
        }!
    })

    // If profile exists, return it
    if (profile) return profile

    // If profile does not exist, create it
    const data: { kindeId: string; name: string; email: string; picture?: string } = {
        kindeId: user!.id,
        name: user!.given_name!,
        email: user!.email!,
    };

    if (user!.picture) {
        data.picture = user!.picture;
    }

    const newProfile = await db.profile.create({ data })

    return newProfile
}