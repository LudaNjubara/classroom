import { TAccentColor, TMessageWithSender } from "@/features/classrooms/types";
import { isToday } from "@/utils/misc";
import dayjs from "dayjs";

/* 

    model Message {
  id String @id @unique @default(cuid())

  content   String   @db.VarChar(255)
  timestamp DateTime @default(now())
  fileUrl   String?  @db.Text

  senderId   String
  senderRole MessageSenderType

  channelId String
  channel   ClassroomChannel @relation(fields: [channelId], references: [id])

  deleted Boolean @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([channelId], name: "channelId")
  @@map("messages")
}

TMessageWithSender = Message & {
    senderData: Teacher | Student;
}

model Teacher {
  id String @id @unique @default(cuid())

  name    String @db.VarChar(255)
  address String @db.VarChar(255)
  phone   String @db.VarChar(255)
  city    String @db.VarChar(255)
  state   String @db.VarChar(255)
  country String @db.VarChar(255)
  email   String @unique @db.VarChar(255)

  profileId String
  profile   Profile @relation(fields: [profileId], references: [kindeId])

  organizations OrganizationTeacher[]

  classrooms ClassroomTeacher[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([profileId], name: "profileId")
  @@map("teachers")
}

Student is the same as Teacher

*/

type TMessageProps = {
  data: TMessageWithSender;
  accentColor?: TAccentColor;
  isCurrentUser: boolean;
};

export function Message({ data, isCurrentUser, accentColor }: TMessageProps) {
  return (
    <div
      className={`inline-flex w-fit gap-2 py-2 px-4 rounded-lg bg-slate-950 ${
        isCurrentUser ? "ml-auto bg-white" : ""
      }`}
      style={
        isCurrentUser && accentColor
          ? {
              background: `linear-gradient(145deg, ${accentColor.base}, ${accentColor.dark})`,
            }
          : undefined
      }
    >
      <div>
        {/* Date and time */}
        <p
          className={`text-xs font-medium ${
            isCurrentUser ? "text-black text-right" : "text-white opacity-60"
          }`}
        >
          {isToday(new Date(data.timestamp))
            ? dayjs(data.timestamp).format("HH:mm A")
            : dayjs(data.timestamp).format("MM/DD/YYYY HH:mm A")}
        </p>

        {/* Sender name and message */}
        {!isCurrentUser && (
          <p className={`text-sm mb-1 font-bold ${isCurrentUser ? "text-black" : "text-white"}`}>
            {data.senderData.name}
          </p>
        )}
        <p className={`text-sm font-medium ${isCurrentUser ? "text-black" : "text-white"}`}>{data.content}</p>
      </div>
    </div>
  );
}
