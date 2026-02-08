import { useState } from "react";
import { useKanbanStorage } from "../hooks/useKanbanStorage";
import Column from "./Column";
import CardItem from "./CardItem";
import CardModal from "./CardModal";

const KanbanBoard = () => {
  const { columns, setColumns } = useKanbanStorage();
  const [dragged, setDragged] = useState<{
    cardId: string;
    fromColumnId: string;
  } | null>(null);
  const [modal, setModal] = useState<{
    mode: "add" | "edit";
    columnId: string;
    card?: any;
  } | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const handleDrop = (targetColumnId: string) => {
    if (!dragged) return;

    const { cardId, fromColumnId } = dragged;
    if (fromColumnId === targetColumnId) return;

    let movedCard: any;

    const updated = columns.map((col) => {
      if (col.id === fromColumnId) {
        const card = col.cards.find((c) => c.id === cardId);
        movedCard = card;
        return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
      }
      return col;
    });

    if (!movedCard) return;

    setColumns(
      updated.map((col) =>
        col.id === targetColumnId
          ? { ...col, cards: [...col.cards, movedCard] }
          : col,
      ),
    );

    setDragged(null);
  };

  const handleSave = () => {
    if (!formData.title.trim() || !modal) return;

    if (modal.mode === "add") {
      setColumns(
        columns.map((col) =>
          col.id === modal.columnId
            ? {
                ...col,
                cards: [
                  ...col.cards,
                  {
                    id: Date.now().toString(),
                    title: formData.title,
                    description: formData.description,
                  },
                ],
              }
            : col,
        ),
      );
    }

    if (modal.mode === "edit" && modal.card) {
      setColumns(
        columns.map((col) =>
          col.id === modal.columnId
            ? {
                ...col,
                cards: col.cards.map((c) =>
                  c.id === modal.card.id ? { ...c, ...formData } : c,
                ),
              }
            : col,
        ),
      );
    }

    setModal(null);
    setFormData({ title: "", description: "" });
  };

  const getColor = (id: string) =>
    id === "todo"
      ? "bg-blue-500"
      : id === "in-progress"
        ? "bg-orange-500"
        : "bg-green-500";

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="grid md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            color={getColor(col.id)}
            onAdd={() => setModal({ mode: "add", columnId: col.id })}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.id)}
          >
            {col.cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                columnId={col.id}
                color={getColor(col.id)}
                onDragStart={() =>
                  setDragged({ cardId: card.id, fromColumnId: col.id })
                }
                onEdit={() =>
                  setModal({ mode: "edit", columnId: col.id, card })
                }
                onDelete={() =>
                  setColumns(
                    columns.map((c) =>
                      c.id === col.id
                        ? {
                            ...c,
                            cards: c.cards.filter((x) => x.id !== card.id),
                          }
                        : c,
                    ),
                  )
                }
              />
            ))}
          </Column>
        ))}
      </div>

      {modal && (
        <CardModal
          mode={modal.mode}
          formData={formData}
          setFormData={setFormData}
          onClose={() => setModal(null)}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
