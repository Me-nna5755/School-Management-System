import { NonRetriableError } from "inngest";
import Class from "../models/class.Schema";
import { inngest } from "./index";
import User from "../models/user.Schema";
import type { GenSettings } from "../models/genSettings.interface";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import Timetable from "../models/timetable.Schema";
import type { IDaySchedule } from '../models/timetable.Schema';
import Exam from "../models/exams.model";


export const generateTimeTable = inngest.createFunction(
    {
        id: "generate-timetable",
        triggers: [
            { event: "timetable/generate" }
        ]
    },
    async ({ event, step }) => {
      const {classId , academicYearId , settings } = event.data as{
        classId:string,
        academicYearId:string ,
        settings:GenSettings
      }
      const contextData=  await step.run("fetch-class-context" , async () => {
          //fetch class
          const classDate = await Class.findById(classId).populate<{
              subjects: { _id: string; name: string; code: string; hoursPerWeek: number }[];
          }>("subjects")
          if (!classDate) {   throw new NonRetriableError("class not found") }

          // fetch teacher
          const allTeacher = await User.find({role:"teacher"})

          const classSubjectIds = classDate.subjects.map((sub)=> sub._id.toString() )
          const qualifiedTeachers = allTeacher.filter(
            (teacher)=>{
              if (!teacher.teacherSubject)
                { return false }

              return teacher.teacherSubject.some(
                        (subId) =>
                            classSubjectIds.includes(subId.toString())
                    );
                })
                .map((teacher) => ({
                    _id: teacher._id,
                    name: teacher.name,
                    subjects: teacher.teacherSubject
                }));
          
          const subjectsPayload = classDate.subjects.map(sub => ({
                id: sub._id.toString(),
                name: sub.name,
                code: sub.code,
                hoursPerWeek: sub.hoursPerWeek
            }));

            return {
                className: classDate.name,
                subjects: subjectsPayload,
                teachers: qualifiedTeachers
            };
        }
    );
    // generate timetable
const timetable = await step.run(
    "generate-timeTable-logic",
    async () => {

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!apiKey) {
            throw new NonRetriableError(
                "GOOGLE_GENERATIVE_AI_API_KEY is missing"
            );
        }
        const allTimetables = await Timetable.find({
            academicYear: academicYearId,
            class: { $ne: classId },
        });

        

const prompt = `
You are an expert school timetable scheduler.

TASK:
Generate a weekly school timetable from Monday to Friday.

CLASS INFORMATION:
- Class Name: ${contextData.className}
- School Start Time: ${settings.startTime}
- School End Time: ${settings.endTime}
- Number of Lessons Per Day: ${settings.periods}

AVAILABLE RESOURCES:

SUBJECTS:
${JSON.stringify(contextData.subjects)}

TEACHERS:
${JSON.stringify(contextData.teachers)}

EXISTING TIMETABLES:
${JSON.stringify(allTimetables)}

STRICT SCHEDULING RULES:

1. Generate a schedule for all five days:
   Monday, Tuesday, Wednesday, Thursday, Friday.

2. Each day must contain exactly ${settings.periods} lesson slots.

3. Each subject must be scheduled exactly according to its
   hoursPerWeek value.

4. Never schedule a subject more times than its hoursPerWeek.

5. Distribute each subject's lessons fairly across the
   five days whenever possible.

6. Every assigned lesson must have a subject and a teacher.

7. A teacher can only teach a subject if its ID exists
   in that teacher's subjects list.

8. Never assign the same teacher to two classes
   at the same time.

9. Consider all existing timetables when assigning teachers.

10. Add a 10-minute break after every 2 lessons.

11. Add a 30-minute lunch break after the 5th lesson,
    starting at 12:00 PM, if the school schedule allows it.

12. All lesson times must be within the specified
    school working hours.

13. Lessons must not overlap.

14. Use the exact subject IDs and teacher IDs
    provided in the resources.

15. If the total required subject lessons are fewer
    than the available weekly lesson slots, leave
    the remaining slots empty.

16. For an empty slot, use:
    {
      "subject": null,
      "teacher": null,
      "startTime": "HH:MM",
      "endTime": "HH:MM"
    }

17. Never invent subjects, teachers, or IDs.

18. Verify that every subject appears exactly
    hoursPerWeek times during the entire week.

OUTPUT REQUIREMENTS:

Return valid JSON only.
Do not include Markdown or explanations.

Use this exact structure:

{
  "schedule": [
    {
      "day": "Monday",
      "periods": [
        {
          "subject": "SUBJECT_ID",
          "teacher": "TEACHER_ID",
          "startTime": "08:00",
          "endTime": "08:44"
        }
      ]
    }
  ]
}
`;

        const google = createGoogleGenerativeAI({
            apiKey,
        });

        const activeModel = google("gemini-3-flash-preview");

        const { text } = await generateText({
            model: activeModel,
            prompt,
        });

        const cleanJSON = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleanJSON);
    }
);

// Save timetable in MongoDB
const savedTimetable = await step.run(
    "save-timetable",
    async () => {
        const result = await Timetable.findOneAndDelete(
          {class:classId , academicYear:academicYearId});
          await Timetable.create({
            class:classId ,
            academicYear:academicYearId,
            schedule: timetable.schedule
          })

          return result
          //{success :true , classId}
    }
);

    return {
        contextData , aiSchedule: timetable ,
        savedTimetable,
    };
});
//sleep("wait-a-moment" , '1s')

export const generateExam = inngest.createFunction( { id: "generate-exam",
        triggers: [
            { event: "exam/generate" }
        ]
    },
    async ({ event, step }) => {
        const { examId,topic,subjectName,difficulty, count } = event.data as {
            examId: string;
            topic: string;
            subjectName: string;
            difficulty: string;
            count: number;
        };

        // Fetch exam
        const exam = await step.run(
            "fetch-exam",
            async () => {
                const result = await Exam.findById(examId);
                if (!result) {
                    throw new NonRetriableError("Exam not found");
                }
                return result;
            }
        );

        // Generate questions using AI
        const generatedQuestions = await step.run(
            "generate-exam-questions",
            async () => {
                const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
                if (!apiKey) {
                    throw new NonRetriableError(
                        "GOOGLE_GENERATIVE_AI_API_KEY is missing"
                    );
                }

                const prompt = `
                  You are an expert school exam creator.

                  TASK:
                  Generate exactly ${count} exam questions.

                  SUBJECT:
                  ${subjectName}

                  TOPIC:
                  ${topic}

                  DIFFICULTY:
                  ${difficulty}

                  QUESTION RULES:

                  1. Generate exactly ${count} questions.
                  2. Every question must have a questionText.
                  3. Question type must be either MCQ or SHORT_ANSWER.
                  4. MCQ questions must have exactly 4 options.
                  5. SHORT_ANSWER questions must have an empty options array.
                  6. Every question must have a correctAnswer.
                  7. Every question must have points equal to 1.

                  OUTPUT:
                  Return valid JSON only.
                  Do not include Markdown or explanations.

                  Use this exact structure:

                  {
                    "questions": [
                      {
                        "questionText": "Question text",
                        "type": "MCQ",
                        "options": ["A", "B", "C", "D"],
                        "correctAnswer": "A",
                        "points": 1
                      }
                    ]
                  }
                  `;

                const google = createGoogleGenerativeAI({ apiKey });
                const activeModel = google("gemini-3-flash-preview");
                const { text } = await generateText({
                    model: activeModel,
                    prompt,
                });

                const cleanJSON = text
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

                const parsedData = JSON.parse(cleanJSON);

                if ( !Array.isArray(parsedData.questions) ||  parsedData.questions.length !== count ) {
                    throw new Error("Invalid generated questions");
                }
                return parsedData.questions;
            }
        );

        // Save questions in MongoDB
        const savedExam = await step.run(
            "save-exam-questions",
            async () => {
                const result = await Exam.findByIdAndUpdate( examId,
                    {  $set: {  questions: generatedQuestions ,  isActive: true} },
                    { new: true, runValidators: true}
                );

                if (!result) {
                    throw new Error("Failed to save exam questions");
                }

                return {
                    success: true,
                    examId: result._id,
                    questionsCount: generatedQuestions.length,
                };
            }
        );

        return { examId, topic, subjectName, generatedQuestions, savedExam, };
    }
);
      





