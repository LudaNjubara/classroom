export enum EAssignmentStatisticsEvent {
    SUBMISSIONS_COUNT = "SUBMISSIONS_COUNT",
    ON_TIME_SUBMISSIONS_COUNT = "ON_TIME_SUBMISSIONS_COUNT",
    NOTES_COUNT = "NOTES_COUNT",
    DOWNLOADED_RESOURCES_COUNT = "DOWNLOADED_RESOURCES_COUNT",
    LOCKED_SUBMISSIONS_COUNT = "LOCKED_SUBMISSIONS_COUNT",
    GRADE_SUM_TOTAL = "GRADE_SUM_TOTAL",
    GRADE_COUNT = "GRADE_COUNT",
}

export enum EClassroomStatisticsEvent {
    TOTAL_CLASSROOM_RESOURCE_DOWNLOAD_COUNT = "TOTAL_CLASSROOM_RESOURCE_DOWNLOAD_COUNT",
}

export enum ECommunicationStatisticsEvent {
    TOTAL_CALL_DURATION = "TOTAL_CALL_DURATION",
    TOTAL_NUMBER_OF_CALLS = "TOTAL_NUMBER_OF_CALLS",
    TOTAL_NUMBER_OF_MESSAGES = "TOTAL_NUMBER_OF_MESSAGES",
}

export enum ECallType {
    DEFAULT = "default",
    AUDIO_ROOM = "audio_room",
    LIVESTREAM = "livestream",
    DEVELOPMENT = "development"
}