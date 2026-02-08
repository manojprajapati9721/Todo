import React, { useState } from 'react';
import { Trash2, Plus, Edit, X } from 'lucide-react';

interface Card {
  id: string;
  title: string;
  description: string;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

const initialData: Column[] = [
  {
    id: 'todo',
    title: 'Todo',
    cards: [
      { id: '1', title: 'Create initial project plan', description: 'Draft the project timeline and milestones' },
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    cards: [
      { id: '4', title: 'Implement authentication', description: 'Add login and signup functionality with JWT' },
    ]
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      { id: '8', title: 'Write API documentation', description: 'Document all endpoints and response formats' }
    ]
  }
];

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(initialData);
  const [draggedCard, setDraggedCard] = useState<{ cardId: string; sourceColumnId: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentColumn, setCurrentColumn] = useState<string>('');
  const [editingCard, setEditingCard] = useState<{ columnId: string; cardId: string } | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  const openAddModal = (columnId: string) => {
    setModalMode('add');
    setCurrentColumn(columnId);
    setFormData({ title: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (columnId: string, card: Card) => {
    setModalMode('edit');
    setCurrentColumn(columnId);
    setEditingCard({ columnId, cardId: card.id });
    setFormData({ title: card.title, description: card.description });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ title: '', description: '' });
    setEditingCard(null);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('Please enter a task name');
      return;
    }

    if (modalMode === 'add') {
      const newCard: Card = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description
      };

      setColumns(columns.map(col => 
        col.id === currentColumn 
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      ));
    } else if (modalMode === 'edit' && editingCard) {
      setColumns(columns.map(col =>
        col.id === editingCard.columnId
          ? {
              ...col,
              cards: col.cards.map(card =>
                card.id === editingCard.cardId 
                  ? { ...card, title: formData.title, description: formData.description }
                  : card
              )
            }
          : col
      ));
    }

    closeModal();
  };

  const deleteCard = (columnId: string, cardId: string) => {
    setColumns(columns.map(col =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter(card => card.id !== cardId) }
        : col
    ));
  };

  const handleDragStart = (cardId: string, columnId: string) => {
    setDraggedCard({ cardId, sourceColumnId: columnId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumnId: string) => {
    if (!draggedCard) return;

    const { cardId, sourceColumnId } = draggedCard;

    if (sourceColumnId === targetColumnId) {
      setDraggedCard(null);
      return;
    }

    const sourceColumn = columns.find(col => col.id === sourceColumnId);
    const cardToMove = sourceColumn?.cards.find(card => card.id === cardId);

    if (!cardToMove) return;

    setColumns(columns.map(col => {
      if (col.id === sourceColumnId) {
        return { ...col, cards: col.cards.filter(card => card.id !== cardId) };
      }
      if (col.id === targetColumnId) {
        return { ...col, cards: [...col.cards, cardToMove] };
      }
      return col;
    }));

    setDraggedCard(null);
  };

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return 'bg-blue-500';
      case 'in-progress':
        return 'bg-orange-500';
      case 'done':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Project Board</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className="bg-gray-800 rounded-lg shadow-lg flex flex-col border border-gray-700"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              {/* Column Header */}
              <div className={`${getColumnColor(column.id)} text-white p-4 rounded-t-lg flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-lg">{column.title}</h2>
                  <span className="bg-white/30 px-2 py-0.5 rounded-full text-sm">
                    {column.cards.length}
                  </span>
                </div>
                <button
                  onClick={() => openAddModal(column.id)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  aria-label="Add card"
                >
                  <Plus size={20} />
                </button>
              </div>

              {/* Add Card Button */}
              <button
                onClick={() => openAddModal(column.id)}
                className="m-4 mb-2 p-2 text-gray-300 hover:bg-gray-700 rounded border-2 border-dashed border-gray-600 hover:border-gray-500 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                <span className="text-sm">Add Card</span>
              </button>

              {/* Cards Container */}
              <div className="flex-1 p-4 pt-2 space-y-3 min-h-[200px]">
                {column.cards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => handleDragStart(card.id, column.id)}
                    className="bg-gray-750 border border-gray-600 rounded-lg p-3 shadow-md hover:shadow-xl transition-shadow cursor-move group hover:border-gray-500"
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-1 h-6 ${getColumnColor(column.id)} rounded-full flex-shrink-0`}></div>
                      
                      <div className="flex-1">
                        <h3 className="text-gray-100 font-medium">{card.title}</h3>
                        {card.description && (
                          <p className="text-sm text-gray-400 mt-1">{card.description}</p>
                        )}
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(column.id, card)}
                          className="text-blue-400 hover:bg-blue-900/30 p-1 rounded transition-all flex-shrink-0"
                          aria-label="Edit card"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => deleteCard(column.id, card.id)}
                          className="text-red-400 hover:bg-red-900/30 p-1 rounded transition-all flex-shrink-0"
                          aria-label="Delete card"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Add/Edit Card */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">
                  {modalMode === 'add' ? 'Add New Task' : 'Edit Task'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 space-y-4">
                <div>
                  <label htmlFor="task-title" className="block text-sm font-medium text-gray-300 mb-1">
                    Task Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="task-title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter task name"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="task-description" className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="task-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter task description (optional)"
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-4 border-t border-gray-700">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium"
                >
                  {modalMode === 'add' ? 'Add Task' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanBoard;
