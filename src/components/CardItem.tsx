import { Edit, Trash2 } from 'lucide-react';
import type { Card } from '../data/initialData';

interface Props {
  card: Card;
  columnId: string;
  color: string;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
}

const CardItem: React.FC<Props> = ({
  card,
  color,
  onEdit,
  onDelete,
  onDragStart,
}) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-gray-750 border border-gray-600 rounded-lg p-3 shadow-md hover:shadow-xl cursor-move group"
    >
      <div className="flex gap-2">
        <div className={`w-1 h-6 ${color} rounded-full`} />
        <div className="flex-1">
          <h3 className="text-gray-100 font-medium">{card.title}</h3>
          {card.description && (
            <p className="text-sm text-gray-400 mt-1">{card.description}</p>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100">
          <button onClick={onEdit} className="text-blue-400 p-1 cursor-pointer">
            <Edit size={16} />
          </button>
          <button onClick={onDelete} className="text-red-400 p-1 cursor-pointer">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
