import { Plus } from "lucide-react";
import type { Column as ColumnType } from "../data/initialData";

interface Props {
  column: ColumnType;
  color: string;
  onAdd: () => void;
  onDrop: () => void;
  onDragOver: (e: React.DragEvent) => void;
  children: React.ReactNode;
}

const Column: React.FC<Props> = ({
  column,
  color,
  onAdd,
  onDrop,
  onDragOver,
  children,
}) => {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="bg-gray-800 rounded-lg border border-gray-700 flex flex-col"
    >
      <div className={`${color} p-4 text-white flex justify-between`}>
        <h2 className="font-semibold">{column.title}</h2>
        <button onClick={onAdd} className="cursor-pointer">
          <Plus size={18} />
        </button>
      </div>

      <button
        onClick={onAdd}
        className="m-4 border-2 border-dashed border-gray-600 p-2 text-gray-300 rounded cursor-pointer"
      >
        + Add Task
      </button>

      <div className="p-4 pt-2 space-y-3 flex-1">{children}</div>
    </div>
  );
};

export default Column;
