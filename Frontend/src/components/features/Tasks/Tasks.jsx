import React from "react";

import TaskHeader from "../components/Task/TaskHeader";
import TaskStats from "../components/Task/TaskStats";
import TaskList from "../components/Task/TaskList";

import { useTasks } from "../../../context/WorkContext";

function Tasks() {
  const { tasks } = useTasks();

  return (
    <div className="p-5 space-y-5">

      <TaskHeader />

      <TaskStats tasks={tasks} />

      <TaskList tasks={tasks} />

    </div>
  );
}

export default Tasks;