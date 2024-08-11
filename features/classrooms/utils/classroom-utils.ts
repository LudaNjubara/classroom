import { sanitizeInput } from "@/utils/misc";
import { TAccentColor, TClassroomAssignmentWithTeacher, TClassroomInsight, TEditedAssignment } from "../types";

// generate { dark, darker, light, lighter } colors from a seed color
export const generateAccentColorsFromSeed = (seed: string): TAccentColor => {
    const seedColor = seed.replace("#", "");
    const seedColorNumber = parseInt(seedColor, 16);

    const red = (seedColorNumber >> 16) & 0xFF;
    const green = (seedColorNumber >> 8) & 0xFF;
    const blue = seedColorNumber & 0xFF;

    const dark = `#${((Math.max(red - 0x33, 0) << 16) | (Math.max(green - 0x33, 0) << 8) | Math.max(blue - 0x33, 0)).toString(16).padStart(6, '0')}`;
    const darker = `#${((Math.max(red - 0x66, 0) << 16) | (Math.max(green - 0x66, 0) << 8) | Math.max(blue - 0x66, 0)).toString(16).padStart(6, '0')}`;
    const light = `#${((Math.min(red + 0x33, 0xFF) << 16) | (Math.min(green + 0x33, 0xFF) << 8) | Math.min(blue + 0x33, 0xFF)).toString(16).padStart(6, '0')}`;
    const lighter = `#${((Math.min(red + 0x66, 0xFF) << 16) | (Math.min(green + 0x66, 0xFF) << 8) | Math.min(blue + 0x66, 0xFF)).toString(16).padStart(6, '0')}`;

    return {
        dark,
        darker,
        base: seed,
        light,
        lighter,
    };
}

export const hexToRGBA = (hex: string, opacity: number) => {
    if (!hex) return

    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const validateEditedClassroomAssignment = (
    originalAssignment: TClassroomAssignmentWithTeacher,
    editedAssignment: TEditedAssignment
) => {
    const errors: TEditedAssignment = {
        title: "",
        description: "",
        dueDate: "",
    };

    if (!sanitizeInput(editedAssignment.title)) {
        errors.title = "Title is required";
    }

    if (!sanitizeInput(editedAssignment.description)) {
        errors.description = "Description is required";
    }

    if (!sanitizeInput(editedAssignment.dueDate)) {
        errors.dueDate = "Due date is required";
    }

    if (new Date(sanitizeInput(editedAssignment.dueDate)) < new Date()) {
        errors.dueDate = "Due date must be in the future";
    }

    return errors;
};

export const generateInsightsPrompt = (insights: TClassroomInsight): string => {
    const { classroomInsights, assignmentInsights, communicationInsights } = insights;

    const baseClassroomStats = Object.values(classroomInsights.base)
        .map(stat => `${stat.title}: ${stat.value}`)
        .join('. ');

    const aggregatedClassroomStats = Object.values(classroomInsights.aggregated)
        .map(stat => {
            const value = stat.representAs === 'percentage' ? (stat.value * 100).toFixed(2) : stat.value;
            return `${stat.title}: ${value}${stat.representAs === 'percentage' ? '%' : ''} (${stat.meaning})`;
        })
        .join('. ');

    const baseAssignmentStats = Object.values(assignmentInsights.total)
        .map(stat => `${stat.title}: ${stat.value}`)
        .join('. ');

    const aggregatedAssignmentStats = Object.values(assignmentInsights.aggregated)
        .map(stat => {
            const value = stat.representAs === 'percentage' ? (stat.value * 100).toFixed(2) : stat.value;
            return `${stat.title}: ${value}${stat.representAs === 'percentage' ? '%' : ''} (${stat.meaning})`;
        })
        .join('. ');

    const baseCommunicationStats = Object.values(communicationInsights.base)
        .map(stat => `${stat.title}: ${stat.value}`)
        .join('. ');

    const aggregatedCommunicationStats = Object.values(communicationInsights.aggregated)
        .map(stat => {
            const value = stat.representAs === 'percentage' ? (stat.value * 100).toFixed(2) : stat.value;
            return `${stat.title}: ${value}${stat.representAs === 'percentage' ? '%' : ''} (${stat.meaning})`;
        })
        .join('. ');

    const prompt = `
    Imagine you are a highly-experienced educator who has been teaching in the classroom for years. You possess a wealth of knowledge and expertise in the field of education i.e. reading long text, analyzing data, and summarizing key insights. Your response should be detailed and informative, providing valuable feedback and recommendations to the teacher reading your response in order to improve the teaching process and their approach to students, app in which they operate, and teaching in general. Your manner of speech should be professional, and insightful, reflecting your expertise in the subject matter.

    Based on the provided classroom insights, please generate a comprehensive summary that addresses the following points:

    1. **Summary of Key Insights**:
       - **Classroom Resource Downloads**: ${baseClassroomStats}. Aggregated data: ${aggregatedClassroomStats}.
       - **Assignment Submissions**: ${baseAssignmentStats}. Aggregated data: ${aggregatedAssignmentStats}.
       - **Communication Activity**: ${baseCommunicationStats}. Aggregated data: ${aggregatedCommunicationStats}.
    
    2. **Interpretation of Data**:
       - Explain what these insights mean in the context of student engagement, resource utilization, assignment completion, and communication habits within the classroom.
    
    3. **Areas for Improvement**:
       - Based on the insights, identify specific areas where the teaching process can be improved. Provide actionable suggestions on how these improvements could be implemented.
       - Highlight any areas of concern or metrics that are below expected standards. Suggest methods to address these issues and improve performance in those areas.

    4. **Current Strengths**:
       - Identify areas where the classroom is performing well according to the data. Mention any metrics that meet or exceed common ratios or standards, indicating positive trends or successful practices.

    5. **Recommendations**:
       - Based on the overall analysis, provide recommendations for the educator or classroom administrator on how to enhance the teaching process, increase student engagement, and foster better communication.

    Please ensure that the summary is concise, yet detailed enough to provide clear guidance on how the data can be used to improve the overall learning environment. Your response should be well-structured, coherent, and demonstrate your expertise in interpreting educational data. Make sure that your summary does not exceed 300 words and that you format it in markdown.
    `;

    console.log("Prompt", prompt);

    return prompt;
};