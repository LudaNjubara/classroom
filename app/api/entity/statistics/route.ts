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
            console.log(`Total classroom resource downloads issue: Expected ${MIN_NUM_OF_CLASSROOM_STATISTICS_RESOURCES_DOWNLOADS_COUNT_FOR_AGGREGATION}, got ${classroomStatistics.totalClassroomResourceDownloads}`);
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
            console.log(`Number of assignment statistics issue: Expected ${MIN_NUM_OF_ASSIGNMENT_STATISTICS_FOR_AGGREGATION}, got ${assignmentStatistics.length}`);
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

        if (communicationStatistics.totalNumberOfCalls < MIN_NUM_OF_COMM_STATISTICS_CALLS_COUNT_FOR_AGGREGATION
            || communicationStatistics.totalNumberOfMessages < MIN_NUM_OF_COMM_STATISTICS_MESSAGES_COUNT_FOR_AGGREGATION) {
            console.log(`Min number of calls issue: Expected ${MIN_NUM_OF_COMM_STATISTICS_CALLS_COUNT_FOR_AGGREGATION}, got ${communicationStatistics.totalNumberOfCalls}`);
            console.log(`Min number of messages issue: Expected ${MIN_NUM_OF_COMM_STATISTICS_MESSAGES_COUNT_FOR_AGGREGATION}, got ${communicationStatistics.totalNumberOfMessages}`);
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
                classroomResourceDownloads: {
                    title: "Classroom Resource Downloads",
                    description: "Total number of classroom resources downloaded",
                    value: classroomStatistics.totalClassroomResourceDownloads
                },
            },
            aggregated: {
                resourceDownloadRate: {
                    title: "Resource Download Rate",
                    description: "Percentage of resources students engage with",
                    meaning: "This metric represents the percentage of provided resources downloaded, indicating the level of engagement and material utilization.",
                    howItWorks: "It compares the total number of classroom resources downloaded to the total number of resources available in the classroom.",
                    value: isFinite(((classroomResourcesCount * studentsCount) / classroomStatistics.totalClassroomResourceDownloads)) ? ((classroomResourcesCount * studentsCount) / classroomStatistics.totalClassroomResourceDownloads) : 0,
                    representAs: "percentage"
                },
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
            console.log(`Assignment submissions count issue: Expected ${MIN_NUM_OF_ASSIGNMENT_STATISTICS_SUBMISSIONS_COUNT_FOR_AGGREGATION}, got ${computedAssignmentStatistics.submissionsCount}`);
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
            total: {
                submissionsCount: {
                    title: "Submissions Count",
                    description: "Total number of submissions ",
                    value: computedAssignmentStatistics.submissionsCount
                },
                onTimeSubmissionsCount: {
                    title: "On Time Submissions Count",
                    description: "Total number of on-time submissions",
                    value: computedAssignmentStatistics.onTimeSubmissionsCount
                },
                notesCount: {
                    title: "Notes Count",
                    description: "Total number of notes",
                    value: computedAssignmentStatistics.notesCount
                },
                downloadedResourcesCount: {
                    title: "Downloaded Resources Count",
                    description: "Total number of resources downloaded",
                    value: computedAssignmentStatistics.downloadedResourcesCount
                },
                lockedSubmissionsCount: {
                    title: "Locked Submissions Count",
                    description: "Total number of completed submissions",
                    value: computedAssignmentStatistics.lockedSubmissionsCount
                },
                gradeSumTotal: {
                    title: "Grade Sum Total",
                    description: "Total sum of grades",
                    value: computedAssignmentStatistics.gradeSumTotal
                },
                gradeCount: {
                    title: "Grade Count",
                    description: "Total number of grades",
                    value: computedAssignmentStatistics.gradeCount
                },
            },
            aggregated: {
                submissionTimeliness: {
                    title: "Submission Timeliness",
                    description: "Percentage of on-time submissions",
                    meaning: "This metric represents the percentage of submissions uploaded before the assignment's due date, indicating the level of student engagement and timeliness in assignment completion.",
                    howItWorks: "It compares the total number of on-time submissions to the total number of submissions.",
                    value: (computedAssignmentStatistics.onTimeSubmissionsCount / computedAssignmentStatistics.submissionsCount) || 0,
                    representAs: "percentage"
                },
                assignmentNoteUsage: {
                    title: "Assignment Note Usage",
                    description: "Percentage of submissions with notes",
                    meaning: "This metric represents the percentage of submissions taken in which there were provided student notes, indicating the level of student engagement and note-taking behavior.",
                    howItWorks: "It compares the total number of notes to the total number of submissions.",
                    value: (computedAssignmentStatistics.notesCount / computedAssignmentStatistics.submissionsCount) || 0,
                    representAs: "percentage"
                },
                assignmentResourceUsage: {
                    title: "Assignment Resource Usage",
                    description: "Percentage of resources downloaded",
                    meaning: "This metric represents the percentage of resources downloaded compared to the total number of resources available, indicating the level of student engagement and resource utilization.",
                    howItWorks: "It compares the total number of resources downloaded to the number of resources downloaded if each student were to download all resources exactly once.",
                    value: (computedAssignmentStatistics.downloadedResourcesCount / (studentsCount * assignmentResourcesCount)) || 0,
                    representAs: "percentage"
                },
                assignmentCompletionRate: {
                    title: "Assignment Completion Rate",
                    description: "Percentage of completed submissions",
                    meaning: "This metric represents the percentage of submissions which were graded and locked for any further edits, indicating the level of student engagement and assignment completion rate.",
                    howItWorks: "It compares the total number of completed submissions to the total number of submissions.",
                    value: (computedAssignmentStatistics.lockedSubmissionsCount / studentsCount / assignments.length) || 0,
                    representAs: "percentage"
                },
                gradeDistribution: {
                    title: "Grade Distribution",
                    description: "Average grade distribution",
                    meaning: "This metric represents the average grade distribution, indicating the level of student performance and grade distribution.",
                    howItWorks: "It compares the total sum of grades to the total number of grades.",
                    value: (computedAssignmentStatistics.gradeSumTotal / computedAssignmentStatistics.gradeCount) || 0,
                    representAs: "number"
                },
            },
        };

        // Final communication statistics
        const numberOfDays = (new Date().getTime() - new Date(sinceDate).getTime()) / (24 * 60 * 60 * 1000);

        const finalCommunicationStatistics: TAggregatedCommunicationInsight = {
            base: {
                callDuration: {
                    title: "Call Duration",
                    description: "Total duration of calls made",
                    value: communicationStatistics.totalCallDuration
                },
                numberOfCalls: {
                    title: "Number of Calls",
                    description: "Total number of calls made",
                    value: communicationStatistics.totalNumberOfCalls
                },
                numberOfMessages: {
                    title: "Number of Messages",
                    description: "Total number of messages sent",
                    value: communicationStatistics.totalNumberOfMessages
                },
            },
            aggregated: {
                callDuration: {
                    title: "Call Duration",
                    description: "Average duration of calls made",
                    meaning: "This metric represents the average call duration made by members of the classroom, indicating the level of communication and engagement.",
                    howItWorks: "It compares the total call duration to the total number of calls made.",
                    value: (communicationStatistics.totalCallDuration / communicationStatistics.totalNumberOfCalls) || 0,
                    representAs: "number"
                },
                callFrequency: {
                    title: "Call Frequency",
                    description: "Average number of calls made in the last week",
                    meaning: "This metric represents the average number of calls made by members of the classroom in the last week, indicating the level of communication and engagement.",
                    howItWorks: "It compares the total number of calls made in the last week to the number of days in the last week.",
                    value: communicationStatistics.totalNumberOfCalls / numberOfDays, // TODO: promijeniti tako da communicationStatistics.totalNumberOfCalls zapravo gleda zadnjih numberOfDays dana
                    representAs: "number"
                },
                preferredCommMethod: {
                    title: "Preferred Communication Method",
                    description: "The preferred communication method used",
                    meaning: "This metric represents the preferred communication method used by members of the classroom.",
                    howItWorks: "It compares the total number of calls to the total number of messages sent.",
                    value: (communicationStatistics.totalNumberOfCalls / communicationStatistics.totalNumberOfMessages) || 0,
                    representAs: "number"
                },
            },
        };

        const data: TClassroomInsight = {
            classroomInsights: finalClassroomStatistics,
            assignmentInsights: finalAssignmentStatistics,
            communicationInsights: finalCommunicationStatistics,
        };

        return NextResponse.json({ data }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}