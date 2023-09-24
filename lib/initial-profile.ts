import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { ERROR_MESSAGES } from "@lib/constants/error-constants"
import { db } from "@lib/db"
import { handleError } from "@lib/helpers/handle-error"

export const initialProfile = async () => {
    const { getUser, isAuthenticated } = getKindeServerSession()

    if (!isAuthenticated()) {
        handleError(ERROR_MESSAGES.CLIENT_ERROR.UNAUTHORIZED.CODE)
    }

    const user = getUser()

    const profile = await db.profile.findUnique({
        where: {
            kindeId: user.id!
        }
    })

    // If profile exists, return it
    if (profile) return profile

    // If profile does not exist, create it
    const newProfile = await db.profile.create({
        data: {
            kindeId: user.id!,
            name: user.given_name!,
            email: user.email!,
            picture: user.picture
        }
    })

    return newProfile
}