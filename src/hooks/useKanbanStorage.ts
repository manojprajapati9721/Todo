import { useEffect, useState } from 'react';
import type { Column } from '../data/initialData';
import { initialData } from '../data/initialData';

const STORAGE_KEY = 'kanban-board-data';

export const useKanbanStorage = () => {
  const [columns, setColumns] = useState<Column[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

  return { columns, setColumns };
};
