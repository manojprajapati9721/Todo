import { X } from 'lucide-react';

interface Props {
  mode: 'add' | 'edit';
  formData: { title: string; description: string };
  setFormData: any;
  onClose: () => void;
  onSubmit: () => void;
}

const CardModal: React.FC<Props> = ({
  mode,
  formData,
  setFormData,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-full max-w-md rounded-lg">
        <div className="flex justify-between p-4 border-b border-gray-700">
          <h2 className="text-white">
            {mode === 'add' ? 'Add Task' : 'Edit Task'}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <input
            className="w-full bg-gray-700 p-2 rounded"
            placeholder="Task title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <textarea
            className="w-full bg-gray-700 p-2 rounded"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="flex gap-2 p-4 border-t border-gray-700">
          <button onClick={onClose} className="flex-1 bg-gray-700 p-2 rounded">
            Cancel
          </button>
          <button onClick={onSubmit} className="flex-1 bg-blue-600 p-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
