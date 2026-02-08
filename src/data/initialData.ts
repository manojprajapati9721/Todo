
export interface Card {
  id: string;
  title: string;
  description: string;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export const initialData: Column[] = [
  {
    id: 'todo',
    title: 'Todo',
    cards: [
      {
        id: '1',
        title: 'Create initial project plan',
        description: 'Draft the project timeline and milestones',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    cards: [
      {
        id: '4',
        title: 'Implement authentication',
        description: 'Add login and signup functionality with JWT',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      {
        id: '8',
        title: 'Write API documentation',
        description: 'Document all endpoints and response formats',
      },
    ],
  },
];
