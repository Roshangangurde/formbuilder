import { useState } from "react";
import { Button, Input, Select } from "@/components/ui";
import { PlusCircle, Trash2 } from "lucide-react";

export default function FormBot() {
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState([]);

  const fieldTypes = [
    "text", "email", "phone", "number", "date", "rating",
    "image", "video", "gif", "button"
  ];

  const addField = () => {
    setFields([...fields, { id: Date.now(), label: "", type: "text" }]);
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(field => field.id === id ? { ...field, [key]: value } : field));
  };

  const removeField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleSubmit = () => {
    const formData = { form_name: formName, fields };
    console.log("Form Data:", formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Form Bot</h1>

      {/* Form Name Input */}
      <Input
        type="text"
        placeholder="Enter form name..."
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        className="mb-4"
      />

      {/* Fields Section */}
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-3 mb-3">
          <Input
            type="text"
            placeholder="Field label..."
            value={field.label}
            onChange={(e) => updateField(field.id, "label", e.target.value)}
          />
          <Select
            value={field.type}
            onChange={(e) => updateField(field.id, "type", e.target.value)}
          >
            {fieldTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
          <Button variant="destructive" onClick={() => removeField(field.id)}>
            <Trash2 size={18} />
          </Button>
        </div>
      ))}

      {/* Add Field Button */}
      <Button variant="outline" onClick={addField} className="mb-4">
        <PlusCircle className="mr-2" /> Add Field
      </Button>

      {/* Submit Button */}
      <Button onClick={handleSubmit} className="w-full">
        Submit Form
      </Button>
    </div>
  );
}
