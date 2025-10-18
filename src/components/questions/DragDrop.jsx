// DragDrop.jsx
import React, { useState, useEffect } from "react";
import { DndContext, closestCenter, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useLanguage } from "../../LanguageContext";
import { pickByLang } from "../../utils/pickByLang";

function Droppable({ id, name, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-[8rem] rounded-xl border-2 border-dashed p-3 transition-colors ${
        isOver ? "border-green-400 bg-green-50" : "border-gray-300 bg-white"
      }`}
    >
      {name && <div className="font-semibold mb-2">{name}</div>}
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function DraggableItem({ id, src }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useDraggable({ id });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    touchAction: "none",
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="p-2 border rounded-lg bg-white shadow-sm cursor-grab active:cursor-grabbing select-none"
    >
      <img
        src={src}
        alt=""
        draggable={false}
        className="w-16 h-16 object-contain pointer-events-none"
      />
    </div>
  );
}

export default function DragDrop({ question, onAnswered }) {
  const { lang, t } = useLanguage();
  const text =
    pickByLang(question?.question, lang) ||
    pickByLang(question?.prompt, lang) ||
    "";

  const items = Array.isArray(question?.items) ? question.items : [];
  const categories = Array.isArray(question?.categories) ? question.categories : [];

  const [locations, setLocations] = useState({});

  useEffect(() => {
    const initial = {};
    items.forEach((it) => (initial[it] = "pool"));
    setLocations(initial);
  }, [question?.id]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const itemId = active.id;
    const newLocation = over.id;

    setLocations((prev) => ({ ...prev, [itemId]: newLocation }));
  };

  const check = () => {
    const ok = categories.every((c) => {
      const expected = new Set(c.items || []);
      const categoryName = pickByLang(c.name, lang); // localized
      const placed = new Set(
        Object.entries(locations)
          .filter(([_, loc]) => loc === categoryName)
          .map(([item]) => item)
      );
      if (expected.size !== placed.size) return false;
      for (let it of expected) if (!placed.has(it)) return false;
      return true;
    });
    onAnswered(ok);
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">{text}</h2>

      <p className="text-sm text-gray-800 italic mb-4">🖐️ {t?.("dragExplain")}</p>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {/* Item pool */}
        <Droppable id="pool" name={t?.("pool") || (lang === "sl" ? "Predmeti" : "Items")}>
          {items
            .filter((it) => locations[it] === "pool")
            .map((it) => (
              <DraggableItem key={it} id={it} src={it} />
            ))}
        </Droppable>

        {/* Categories */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {categories.map((c) => {
            const localizedName = pickByLang(c.name, lang);
            return (
              <Droppable key={localizedName} id={localizedName} name={localizedName}>
                {items
                  .filter((it) => locations[it] === localizedName)
                  .map((it) => (
                    <DraggableItem key={it} id={it} src={it} />
                  ))}
              </Droppable>
            );
          })}
        </div>
      </DndContext>

      <button
        onClick={check}
        className="mt-4 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
      >
        {t?.("check") || (lang === "sl" ? "Preveri" : "Check")}
      </button>
    </div>
  );
}
