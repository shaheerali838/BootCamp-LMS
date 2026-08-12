import React from "react";

import TaskHeader from "../components/Task/TaskHeader";
import TaskStats from "../components/Task/TaskStats";
import TaskList from "../components/Task/TaskList";

import { taskData } from "../components/common/taskData";

function Tasks() {
  return (
    <div className="p-5 space-y-5">

      <TaskHeader />

      <TaskStats tasks={taskData} />

      <TaskList tasks={taskData} />

    </div>
  );
}

export default Tasks;