import { db } from "@/config";
import { MIN_NUM_OF_ASSIGNMENT_STATISTICS_FOR_AGGREGATION, MIN_NUM_OF_ASSIGNMENT_STATISTICS_SUBMISSIONS_COUNT_FOR_AGGREGATION, MIN_NUM_OF_CLASSROOM_STATISTICS_RESOURCES_DOWNLOADS_COUNT_FOR_AGGREGATION, MIN_NUM_OF_COMM_STATISTICS_CALLS_COUNT_FOR_AGGREGATION, MIN_NUM_OF_COMM_STATISTICS_MESSAGES_COUNT_FOR_AGGREGATION } from "@/constants";
import { TAggregatedAssignmentInsight, TAggregatedClassroomInsight, TAggregatedCommunicationInsight, TClassroomInsight } from "@/features/classrooms/types";
import { EAssignmentStatisticsEvent, EClassroomStatisticsEvent, ECommunicationStatisticsEvent } from "@/types/enums";
import { TEventQueue } from "@/types/typings";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

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

type TAllowedRoles = Exclude<Role, "ADMIN" | "GUEST" | "STUDENT">;

export async function GET(req: NextRequest) {
    try {
        const { isAuthenticated, getUser } = getKindeServerSession();

        if (!await isAuthenticated()) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const profile = await db.profile.findUnique({
            where: {
                kindeId: user.id,
            },
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 })
        }

        const allowedRoles: TAllowedRoles[] = ["TEACHER", "ORGANIZATION"];

        if (!allowedRoles.includes(profile.role as TAllowedRoles)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const classroomId = searchParams.get("classroomId");
        const sinceDate = searchParams.get("sinceDate") || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // If not provided, use the date from a week ago

        if (!classroomId) {
            return NextResponse.json({ error: "Missing classroomId" }, { status: 400 });
        }

        // Classroom statistics
        const classroomStatistics = await db.classroomStatistics.findUnique({
            where: {
                classroomId,
            },
        });

        if (!classroomStatistics) {
            return NextResponse.json({ error: "Classroom statistics not found" }, { status: 404 });
        }

        if (classroomStatistics.totalClassroomResourceDownloads < MIN_NUM_OF_CLASSROOM_STATISTICS_RESOURCES_DOWNLOADS_COUNT_FOR_AGGREGATION) {
            console.log("Expected", MIN_NUM_OF_CLASSROOM_STATISTICS_RESOURCES_DOWNLOADS_COUNT_FOR_AGGREGATION, "got", classroomStatistics.totalClassroomResourceDownloads);
            return NextResponse.json({ error: "Not enough data to compute classroom statistics" }, { status: 422 });
        }

        // Assignment statistics
        const assignments = await db.classroomAssignment.findMany({
            where: {
                classroomId,
            },
        });

        const assignmentIds = assignments.map((assignment) => assignment.id);

        const assignmentStatistics = await db.assignmentStatistics.findMany({
            where: {
                assignmentId: {
                    in: assignmentIds,
                },
            },
        });

        if (assignmentStatistics.length < MIN_NUM_OF_ASSIGNMENT_STATISTICS_FOR_AGGREGATION) {
            console.log("Expected", MIN_NUM_OF_ASSIGNMENT_STATISTICS_FOR_AGGREGATION, "got", assignmentStatistics.length);
            return NextResponse.json({ error: "Not enough data to compute assignment statistics" }, { status: 422 });
        }

        // Communication statistics
        const communicationStatistics = await db.communicationStatistics.findUnique({
            where: {
                classroomId,
            },
        });

        if (!communicationStatistics) {
            return NextResponse.json({ error: "Communication statistics not found" }, { status: 404 });
        }

        if (communicationStatistics.totalNumberOfCalls + 14 < MIN_NUM_OF_COMM_STATISTICS_CALLS_COUNT_FOR_AGGREGATION
            || communicationStatistics.totalNumberOfMessages < MIN_NUM_OF_COMM_STATISTICS_MESSAGES_COUNT_FOR_AGGREGATION) {
            console.log("Expected", MIN_NUM_OF_COMM_STATISTICS_CALLS_COUNT_FOR_AGGREGATION, "got", communicationStatistics.totalNumberOfCalls);
            console.log("Expected", MIN_NUM_OF_COMM_STATISTICS_MESSAGES_COUNT_FOR_AGGREGATION, "got", communicationStatistics.totalNumberOfMessages);
            return NextResponse.json({ error: "Not enough data to compute communication statistics" }, { status: 422 });
        }

        // Total number of students in the classroom
        const studentsCount = await db.classroomStudent.count({
            where: {
                classroomId,
            },
        });

        // Final classroom statistics
        const classroomResourcesCount = await db.resourcesMetadata.count({
            where: {
                classroomId,
                channelId: null,
            },
        });

        const finalClassroomStatistics: TAggregatedClassroomInsight = {
            base: {
                classroomResourceDownloads: classroomStatistics.totalClassroomResourceDownloads,
            },
            aggregated: {
                resourceDownloadRate: ((classroomResourcesCount * studentsCount) / classroomStatistics.totalClassroomResourceDownloads) || 0,
            },
        };

        // Final assignment statistics
        const computedAssignmentStatistics = assignmentStatistics.reduce((acc, curr) => {
            acc.submissionsCount += curr.submissionsCount;
            acc.onTimeSubmissionsCount += curr.onTimeSubmissionsCount;
            acc.notesCount += curr.notesCount;
            acc.downloadedResourcesCount += curr.downloadedResourcesCount;
            acc.lockedSubmissionsCount += curr.lockedSubmissionsCount;
            acc.gradeSumTotal += curr.gradeSumTotal;
            acc.gradeCount += curr.gradeCount;

            return acc;
        }, {
            submissionsCount: 0,
            onTimeSubmissionsCount: 0,
            notesCount: 0,
            downloadedResourcesCount: 0,
            lockedSubmissionsCount: 0,
            gradeSumTotal: 0,
            gradeCount: 0,
        });

        if (computedAssignmentStatistics.submissionsCount < MIN_NUM_OF_ASSIGNMENT_STATISTICS_SUBMISSIONS_COUNT_FOR_AGGREGATION) {
            console.log("Expected", MIN_NUM_OF_ASSIGNMENT_STATISTICS_SUBMISSIONS_COUNT_FOR_AGGREGATION, "got", computedAssignmentStatistics.submissionsCount);
            return NextResponse.json({ error: "Not enough data to compute assignment statistics" }, { status: 422 });
        }

        const assignmentResourcesCount = await db.resourcesMetadata.count({
            where: {
                classroomId,
                assignmentId: {
                    in: assignmentIds,
                },
                channelId: null,
            },
        });

        const finalAssignmentStatistics: TAggregatedAssignmentInsight = {
            total: { ...computedAssignmentStatistics },
            aggregated: {
                submissionTimeliness: computedAssignmentStatistics.onTimeSubmissionsCount / computedAssignmentStatistics.submissionsCount,
                assignmentNoteUsage: computedAssignmentStatistics.notesCount / computedAssignmentStatistics.submissionsCount,
                assignmentResourceUsage: (computedAssignmentStatistics.downloadedResourcesCount / (studentsCount * assignmentResourcesCount)) || 0,
                assignmentCompletionRate: (computedAssignmentStatistics.lockedSubmissionsCount / studentsCount) || 0,
                gradeDistribution: (computedAssignmentStatistics.gradeSumTotal / computedAssignmentStatistics.gradeCount) || 0,
            },
        };

        // Final communication statistics
        const numberOfDays = (new Date().getTime() - new Date(sinceDate).getTime()) / (24 * 60 * 60 * 1000);

        const finalCommunicationStatistics: TAggregatedCommunicationInsight = {
            base: {
                callDuration: communicationStatistics.totalCallDuration,
                numberOfCalls: communicationStatistics.totalNumberOfCalls,
                numberOfMessages: communicationStatistics.totalNumberOfMessages,
            },
            aggregated: {
                callDuration: (communicationStatistics.totalCallDuration / communicationStatistics.totalNumberOfCalls) || 0,
                callFrequency: communicationStatistics.totalNumberOfCalls / numberOfDays,
                preferredCommMethod: (communicationStatistics.totalNumberOfCalls / communicationStatistics.totalNumberOfMessages) || 0,
            },
        };

        const data: TClassroomInsight = {
            classroomInsights: finalClassroomStatistics,
            assignmentInsights: finalAssignmentStatistics,
            communicationInsights: finalCommunicationStatistics,
        };

        console.log("data", data);

        return NextResponse.json({ data }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}