import { db } from "@/config";
import { EAssignmentStatisticsEvent, EClassroomStatisticsEvent, ECommunicationStatisticsEvent } from "@/types/enums";
import { TEventQueue } from "@/types/typings";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// TODO: make it so that based on an event it has a switch statement that determines to which table to insert the data. I should then split the events into respective arrays and then insert them into the respective tables. Use transactions.

// Type guards
function isClassroomStatisticsEvent(event: TEventQueue): event is TEventQueue & { event: EClassroomStatisticsEvent } {
    return EClassroomStatisticsEvent[event.event as keyof typeof EClassroomStatisticsEvent] !== undefined;
}

function isAssignmentStatisticsEvent(event: TEventQueue): event is TEventQueue & { event: EAssignmentStatisticsEvent } {
    return EAssignmentStatisticsEvent[event.event as keyof typeof EAssignmentStatisticsEvent] !== undefined;
}

function isCommunicationStatisticsEvent(event: TEventQueue): event is TEventQueue & { event: ECommunicationStatisticsEvent } {
    return ECommunicationStatisticsEvent[event.event as keyof typeof ECommunicationStatisticsEvent] !== undefined;
}

// Integrity checks
function checkClassroomEventDataIntegrity(event: TEventQueue & { event: EClassroomStatisticsEvent }) {
    if (!event.metadata.classroomId) {
        throw new Error("Invalid metadata for event", { cause: `For event ${event.event} - Expected classroomId, got undefined` });
    }

    switch (event.event) {
        case EClassroomStatisticsEvent.TOTAL_CLASSROOM_RESOURCE_DOWNLOAD_COUNT:
            if (!event.data) {
                throw new Error("Invalid data for event", { cause: `For event ${EClassroomStatisticsEvent.TOTAL_CLASSROOM_RESOURCE_DOWNLOAD_COUNT} - Expected data, got undefined` });
            } else if (event.data.count === undefined) {
                throw new Error("Invalid data for event", { cause: `For event ${EClassroomStatisticsEvent.TOTAL_CLASSROOM_RESOURCE_DOWNLOAD_COUNT} - Expected count, got undefined` });
            } else if (typeof event.data.count !== "number") {
                throw new Error("Invalid data for event", { cause: `For event ${EClassroomStatisticsEvent.TOTAL_CLASSROOM_RESOURCE_DOWNLOAD_COUNT} - Expected number, got ${typeof event.data.count}` });
            }
            break;
    }

}

function checkAssignmentEventDataIntegrity(event: TEventQueue & { event: EAssignmentStatisticsEvent }) {
    if (!event.metadata.assignmentId) {
        throw new Error("Invalid metadata for event", { cause: `For event ${event.event} - Expected assignmentId, got undefined` });
    }

    switch (event.event) {
        case EAssignmentStatisticsEvent.SUBMISSIONS_COUNT:
            if (!event.data) {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.SUBMISSIONS_COUNT} - Expected data, got undefined` });
            } else if (event.data.count === undefined) {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.SUBMISSIONS_COUNT} - Expected count, got undefined` });
            } else if (typeof event.data.count !== "number") {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.SUBMISSIONS_COUNT} - Expected number, got ${typeof event.data.count}` });
            }
            break;
        case EAssignmentStatisticsEvent.ON_TIME_SUBMISSIONS_COUNT:
            if (!event.data) {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.ON_TIME_SUBMISSIONS_COUNT} - Expected data, got undefined` });
            } else if (event.data.count === undefined) {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.ON_TIME_SUBMISSIONS_COUNT} - Expected count, got undefined` });
            } else if (typeof event.data.count !== "number") {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.ON_TIME_SUBMISSIONS_COUNT} - Expected number, got ${typeof event.data.count}` });
            }
            break;
        case EAssignmentStatisticsEvent.NOTES_COUNT:
            if (!event.data) {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.NOTES_COUNT} - Expected data, got undefined` });
            } else if (event.data.count === undefined) {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.NOTES_COUNT} - Expected count, got undefined` });
            } else if (typeof event.data.count !== "number") {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.NOTES_COUNT} - Expected number, got ${typeof event.data.count}` });
            }
            break;
        case EAssignmentStatisticsEvent.DOWNLOADED_RESOURCES_COUNT:
            if (!event.data) {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.DOWNLOADED_RESOURCES_COUNT} - Expected data, got undefined` });
            } else if (event.data.count === undefined) {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.DOWNLOADED_RESOURCES_COUNT} - Expected count, got undefined` });
            } else if (typeof event.data.count !== "number") {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.DOWNLOADED_RESOURCES_COUNT} - Expected number, got ${typeof event.data.count}` });
            }
            break;
        case EAssignmentStatisticsEvent.LOCKED_SUBMISSIONS_COUNT:
            if (!event.data) {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.LOCKED_SUBMISSIONS_COUNT} - Expected data, got undefined` });
            } else if (event.data.count === undefined) {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.LOCKED_SUBMISSIONS_COUNT} - Expected count, got undefined` });
            } else if (typeof event.data.count !== "number") {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.LOCKED_SUBMISSIONS_COUNT} - Expected number, got ${typeof event.data.count}` });
            }
            break;
        case EAssignmentStatisticsEvent.GRADE_SUM_TOTAL:
            if (!event.data) {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.GRADE_SUM_TOTAL} - Expected data, got undefined` });
            } else if (event.data.sum === undefined) {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.GRADE_SUM_TOTAL} - Expected sum, got undefined` });
            } else if (typeof event.data.sum !== "number") {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.GRADE_SUM_TOTAL} - Expected number, got ${typeof event.data.sum}` });
            }
            break;
        case EAssignmentStatisticsEvent.GRADE_COUNT:
            if (!event.data) {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.GRADE_COUNT} - Expected data, got undefined` });
            } else if (event.data.count === undefined) {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.GRADE_COUNT} - Expected count, got undefined` });
            } else if (typeof event.data.count !== "number") {
                throw new Error("Invalid data for event", { cause: `For event ${EAssignmentStatisticsEvent.GRADE_COUNT} - Expected number, got ${typeof event.data.count}` });
            }
            break;
    }
}

function checkCommunicationEventDataIntegrity(event: TEventQueue & { event: ECommunicationStatisticsEvent }) {
    if (!event.metadata.classroomId) {
        throw new Error("Invalid metadata for event", { cause: `For event ${event.event} - Expected classroomId, got undefined` });
    }

    switch (event.event) {
        case ECommunicationStatisticsEvent.TOTAL_CALL_DURATION:
            if (!event.data) {
                throw new Error("Invalid data for event", { cause: `For event ${ECommunicationStatisticsEvent.TOTAL_CALL_DURATION} - Expected data, got undefined` });
            } else if (event.data.duration === undefined) {
                throw new Error("Invalid data for event", { cause: `For event ${ECommunicationStatisticsEvent.TOTAL_CALL_DURATION} - Expected duration, got undefined` });
            } else if (typeof event.data.duration !== "number") {
                throw new Error("Invalid data for event", { cause: `For event ${ECommunicationStatisticsEvent.TOTAL_CALL_DURATION} - Expected number, got ${typeof event.data.duration}` });
            }
            break;
        case ECommunicationStatisticsEvent.TOTAL_NUMBER_OF_CALLS:
            if (!event.data) {
                throw new Error("Invalid data for event", { cause: `For event ${ECommunicationStatisticsEvent.TOTAL_NUMBER_OF_CALLS} - Expected data, got undefined` });
            } else if (event.data.count === undefined) {
                throw new Error("Invalid data for event", { cause: `For event ${ECommunicationStatisticsEvent.TOTAL_NUMBER_OF_CALLS} - Expected count, got undefined` });
            } else if (typeof event.data.count !== "number") {
                throw new Error("Invalid data for event", { cause: `For event ${ECommunicationStatisticsEvent.TOTAL_NUMBER_OF_CALLS} - Expected number, got ${typeof event.data.count}` });
            }
            break;
        case ECommunicationStatisticsEvent.TOTAL_NUMBER_OF_MESSAGES:
            if (!event.data) {
                throw new Error("Invalid data for event", { cause: `For event ${ECommunicationStatisticsEvent.TOTAL_NUMBER_OF_MESSAGES} - Expected data, got undefined` });
            } else if (event.data.count === undefined) {
                throw new Error("Invalid data for event", { cause: `For event ${ECommunicationStatisticsEvent.TOTAL_NUMBER_OF_MESSAGES} - Expected count, got undefined` });
            } else if (typeof event.data.count !== "number") {
                throw new Error("Invalid data for event", { cause: `For event ${ECommunicationStatisticsEvent.TOTAL_NUMBER_OF_MESSAGES} - Expected number, got ${typeof event.data.count}` });
            }
            break;
    }
}

// Update clauses
function constructClassroomEventUpdateClause(event: TEventQueue & { event: EClassroomStatisticsEvent }) {
    switch (event.event) {
        case EClassroomStatisticsEvent.TOTAL_CLASSROOM_RESOURCE_DOWNLOAD_COUNT:
            return {
                totalClassroomResourceDownloads: {
                    increment: event.data.count
                }
            }
    }
}

function constructAssignmentEventUpdateClause(event: TEventQueue & { event: EAssignmentStatisticsEvent }) {
    switch (event.event) {
        case EAssignmentStatisticsEvent.SUBMISSIONS_COUNT:
            return {
                submissionsCount: {
                    increment: event.data.count
                }
            }
        case EAssignmentStatisticsEvent.ON_TIME_SUBMISSIONS_COUNT:
            return {
                onTimeSubmissionsCount: {
                    increment: event.data.count
                }
            }
        case EAssignmentStatisticsEvent.NOTES_COUNT:
            return {
                notesCount: {
                    increment: event.data.count
                }
            }
        case EAssignmentStatisticsEvent.DOWNLOADED_RESOURCES_COUNT:
            return {
                downloadedResourcesCount: {
                    increment: event.data.count
                }
            }
        case EAssignmentStatisticsEvent.LOCKED_SUBMISSIONS_COUNT:
            return {
                lockedSubmissionsCount: {
                    increment: event.data.count
                }
            }
        case EAssignmentStatisticsEvent.GRADE_SUM_TOTAL:
            return {
                gradeSumTotal: {
                    increment: event.data.sum
                }
            }
        case EAssignmentStatisticsEvent.GRADE_COUNT:
            return {
                gradeCount: {
                    increment: event.data.count
                }
            }
    }
}

function constructCommunicationEventUpdateClause(event: TEventQueue & { event: ECommunicationStatisticsEvent }) {
    switch (event.event) {
        case ECommunicationStatisticsEvent.TOTAL_CALL_DURATION:
            return {
                totalCallDuration: {
                    increment: event.data.duration
                }
            }
        case ECommunicationStatisticsEvent.TOTAL_NUMBER_OF_CALLS:
            return {
                totalNumberOfCalls: {
                    increment: event.data.count
                }
            }
        case ECommunicationStatisticsEvent.TOTAL_NUMBER_OF_MESSAGES:
            return {
                totalNumberOfMessages: {
                    increment: event.data.count
                }
            }
    }
}

// Create clauses
function constructClassroomEventCreateClause(event: TEventQueue & { event: EClassroomStatisticsEvent }) {
    switch (event.event) {
        case EClassroomStatisticsEvent.TOTAL_CLASSROOM_RESOURCE_DOWNLOAD_COUNT:
            return {
                classroomId: event.metadata.classroomId!,
                totalClassroomResourceDownloads: event.data.count
            }
    }
}

function constructAssignmentEventCreateClause(event: TEventQueue & { event: EAssignmentStatisticsEvent }) {
    switch (event.event) {
        case EAssignmentStatisticsEvent.SUBMISSIONS_COUNT:
            return {
                assignmentId: event.metadata.assignmentId!,
                submissionsCount: event.data.count
            }
        case EAssignmentStatisticsEvent.ON_TIME_SUBMISSIONS_COUNT:
            return {
                assignmentId: event.metadata.assignmentId!,
                onTimeSubmissionsCount: event.data.count
            }
        case EAssignmentStatisticsEvent.NOTES_COUNT:
            return {
                assignmentId: event.metadata.assignmentId!,
                notesCount: event.data.count
            }
        case EAssignmentStatisticsEvent.DOWNLOADED_RESOURCES_COUNT:
            return {
                assignmentId: event.metadata.assignmentId!,
                downloadedResourcesCount: event.data.count
            }
        case EAssignmentStatisticsEvent.LOCKED_SUBMISSIONS_COUNT:
            return {
                assignmentId: event.metadata.assignmentId!,
                lockedSubmissionsCount: event.data.count
            }
        case EAssignmentStatisticsEvent.GRADE_SUM_TOTAL:
            return {
                assignmentId: event.metadata.assignmentId!,
                gradeSumTotal: event.data.sum
            }
        case EAssignmentStatisticsEvent.GRADE_COUNT:
            return {
                assignmentId: event.metadata.assignmentId!,
                gradeCount: event.data.count
            }
    }
}

function constructCommunicationEventCreateClause(event: TEventQueue & { event: ECommunicationStatisticsEvent }) {
    switch (event.event) {
        case ECommunicationStatisticsEvent.TOTAL_CALL_DURATION:
            return {
                classroomId: event.metadata.classroomId!,
                totalCallDuration: event.data.duration
            }
        case ECommunicationStatisticsEvent.TOTAL_NUMBER_OF_CALLS:
            return {
                classroomId: event.metadata.classroomId!,
                totalNumberOfCalls: event.data.count
            }
        case ECommunicationStatisticsEvent.TOTAL_NUMBER_OF_MESSAGES:
            return {
                classroomId: event.metadata.classroomId!,
                totalNumberOfMessages: event.data.count
            }
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { isAuthenticated, getUser } = getKindeServerSession();

        if (!await isAuthenticated()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { eventsQueue }: { eventsQueue: TEventQueue[] } = await req.json();

        if (eventsQueue.length === 0) {
            return NextResponse.json({ error: "No events to process" }, { status: 400 });
        }

        const classroomEvents = eventsQueue.filter(isClassroomStatisticsEvent);
        const assignmentEvents = eventsQueue.filter(isAssignmentStatisticsEvent);
        const communicationEvents = eventsQueue.filter(isCommunicationStatisticsEvent);

        // Check the integrity of the data for classroom events
        classroomEvents.length > 0 && classroomEvents.forEach((event) => {
            checkClassroomEventDataIntegrity(event);
        });

        // Check the integrity of the data for assignment events
        assignmentEvents.length > 0 && assignmentEvents.forEach((event) => {
            checkAssignmentEventDataIntegrity(event);
        });

        // Check the integrity of the data for communication events
        communicationEvents.length > 0 && communicationEvents.forEach((event) => {
            checkCommunicationEventDataIntegrity(event);
        });

        if (classroomEvents.length > 0) {
            await db.$transaction([
                db.classroomStatistics.updateMany({
                    where: {
                        classroomId: {
                            in: classroomEvents.map((event) => event.metadata.classroomId!)
                        }
                    },
                    data: {
                        ...Object.assign({}, ...classroomEvents.map(constructClassroomEventUpdateClause))
                    }
                })
            ]);
        }

        if (assignmentEvents.length > 0) {
            await db.$transaction([
                db.assignmentStatistics.updateMany({
                    where: {
                        assignmentId: {
                            in: assignmentEvents.map((event) => event.metadata.assignmentId!)
                        }
                    },
                    data: {
                        ...Object.assign({}, ...assignmentEvents.map(constructAssignmentEventUpdateClause))
                    }
                })
            ]);
        }

        if (communicationEvents.length > 0) {
            await db.$transaction([
                db.communicationStatistics.updateMany({
                    where: {
                        classroomId: {
                            in: communicationEvents.map((event) => event.metadata.classroomId!)
                        }
                    },
                    data: {
                        ...Object.assign({}, ...communicationEvents.map(constructCommunicationEventUpdateClause))
                    }
                })
            ]);
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
            console.log(error.cause)
            return NextResponse.json({ error: error.message }, { status: 400 });
        } else {
            return NextResponse.json({ error: "Internal server error" }, { status: 500 });
        }
    }
}