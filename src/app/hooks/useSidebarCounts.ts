"use client";

import { useState, useEffect } from "react";
import { getTasksForUser, getAllBoards } from "@/src/app/lib/projectService";

export function useSidebarCounts() {
  const [todoCount, setTodoCount] = useState(0);
  const [boardsCount, setBoardsCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const [tasks, boards] = await Promise.all([
          getTasksForUser(),
          getAllBoards(),
        ]);
        setTodoCount(tasks.length);
        setBoardsCount(boards.length);
      } catch {
        setTodoCount(0);
        setBoardsCount(0);
      }
    }
    load();
  }, []);

  return { todoCount, boardsCount };
}
