import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const AttendanceContext = createContext();

const STORAGE_KEY = "lms_attendance";

const initialAttendanceData = [
  {
    studentId: 1,
    attendance: [
      {
        date: "2026-08-11",
        status: "Present",
        time: "08:45 AM",
      },
      {
        date: "2026-08-10",
        status: "Present",
        time: "08:52 AM",
      },
      {
        date: "2026-08-09",
        status: "Late",
        time: "09:18 AM",
      },
    ],
  },
  {
    studentId: 2,
    attendance: [
      {
        date: "2026-08-11",
        status: "Absent",
        time: "--:--",
      },
      {
        date: "2026-08-10",
        status: "Present",
        time: "08:48 AM",
      },
      {
        date: "2026-08-09",
        status: "Present",
        time: "08:55 AM",
      },
    ],
  },
  {
    studentId: 3,
    attendance: [
      {
        date: "2026-08-11",
        status: "Present",
        time: "08:50 AM",
      },
      {
        date: "2026-08-10",
        status: "Present",
        time: "08:47 AM",
      },
      {
        date: "2026-08-09",
        status: "Present",
        time: "08:51 AM",
      },
    ],
  },
];

export const AttendanceProvider = ({ children }) => {
  const [attendance, setAttendance] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? JSON.parse(stored) : initialAttendanceData;
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(attendance)
    );
  }, [attendance]);

  const updateAttendance = (
    studentId,
    date,
    status,
    time
  ) => {
    setAttendance((prev) => {
      const studentExists = prev.some(
        (student) => student.studentId === studentId
      );

      if (!studentExists) {
        return [
          ...prev,
          {
            studentId,
            attendance: [
              {
                date,
                status,
                time,
              },
            ],
          },
        ];
      }

      return prev.map((student) => {
        if (student.studentId !== studentId) {
          return student;
        }

        const existingAttendance =
          student.attendance.find(
            (item) => item.date === date
          );

        if (existingAttendance) {
          return {
            ...student,
            attendance: student.attendance.map(
              (item) =>
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
      });
    });
  };

  const getStudentAttendance = (studentId) => {
    return (
      attendance.find(
        (student) => student.studentId === studentId
      )?.attendance || []
    );
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendance,
        updateAttendance,
        setAttendance,
        getStudentAttendance,
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