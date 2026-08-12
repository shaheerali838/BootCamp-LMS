import React, {
  createContext,
  useContext,
  useState,
} from "react";

import { attendanceData } from "../components/common/attendanceData";

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const [attendance, setAttendance] = useState(attendanceData);

  const updateAttendance = (
    studentId,
    date,
    status,
    time
  ) => {
    setAttendance((prev) =>
      prev.map((student) => {
        if (student.id !== studentId) {
          return student;
        }

        const existingAttendance = student.attendance.find(
          (item) => item.date === date
        );

        if (existingAttendance) {
          return {
            ...student,

            attendance: student.attendance.map((item) =>
              item.date === date
                ? {
                    ...item,
                    status,
                    time,
                  }
                : item
            ),
          };
        }

        return {
          ...student,

          attendance: [
            ...student.attendance,
            {
              date,
              status,
              time,
            },
          ],
        };
      })
    );
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendance,
        updateAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);

  if (!context) {
    throw new Error(
      "useAttendance must be used inside AttendanceProvider"
    );
  }

  return context;
};