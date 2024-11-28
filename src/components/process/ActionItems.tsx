import { useState } from "react";
import { ActionItem } from "@/types/process";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";

interface ActionItemsProps {
  items: ActionItem[];
  onUpdate: (items: ActionItem[]) => void;
}

const ActionItems = ({ items, onUpdate }: ActionItemsProps) => {
  const [newItemText, setNewItemText] = useState("");

  const addItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem: ActionItem = {
      id: crypto.randomUUID(),
      text: newItemText,
      completed: false,
      createdAt: new Date(),
    };
    
    onUpdate([...items, newItem]);
    setNewItemText("");
  };

  const toggleItem = (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    onUpdate(updatedItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Add new action item..."
          onKeyPress={(e) => e.key === "Enter" && addItem()}
        />
        <Button onClick={addItem} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <Checkbox
              checked={item.completed}
              onCheckedChange={() => toggleItem(item.id)}
              id={item.id}
            />
            <label
              htmlFor={item.id}
              className={`flex-1 text-sm ${
                item.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {item.text}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionItems;