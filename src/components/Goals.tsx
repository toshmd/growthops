import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState } from "react";

interface CategoriesProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  existingCategories?: string[];
}

const Categories = ({
  selectedCategories,
  onCategoriesChange,
  existingCategories = [],
}: CategoriesProps) => {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory && !selectedCategories.includes(newCategory)) {
      onCategoriesChange([...selectedCategories, newCategory]);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    onCategoriesChange(selectedCategories.filter((c) => c !== category));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a category"
          className="flex-1"
        />
        <Button onClick={handleAddCategory} type="button">
          Add
        </Button>
      </div>
      
      {existingCategories.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Suggested categories:</p>
          <div className="flex flex-wrap gap-2">
            {existingCategories
              .filter((category) => !selectedCategories.includes(category))
              .map((category) => (
                <Badge
                  key={category}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => onCategoriesChange([...selectedCategories, category])}
                >
                  {category}
                </Badge>
              ))}
          </div>
        </div>
      )}

      {selectedCategories.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Selected categories:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="pr-1.5"
              >
                {category}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0.5 ml-1 hover:bg-transparent"
                  onClick={() => handleRemoveCategory(category)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;