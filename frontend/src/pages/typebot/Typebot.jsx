import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";

export default function FormBot() {
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState([]);
  const navigate = useNavigate();

  const fieldTypes = [
    "text", "email", "phone", "number", "date", "rating",
    "image", "video", "gif", "button"
  ];

  const addField = (type) => {
    setFields([...fields, { id: Date.now(), label: type, type }]);
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
    navigate("/invite");
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-1/4 p-4 bg-black">
        <h2 className="text-xl font-bold mb-4">Elements</h2>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Bubbles</h3>
          <div className="space-y-2">
            {["Text", "Image", "Video", "GIF"].map((item) => (
              <Button key={item} className="w-full" onClick={() => addField(item.toLowerCase())}>{item}</Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Inputs</h3>
          <div className="space-y-2">
            {["Text", "Number", "Email", "Phone", "Date", "Rating", "Buttons"].map((item) => (
              <Button key={item} className="w-full" onClick={() => addField(item.toLowerCase())}>{item}</Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Form Bot</h1>

        {/* Form Name Input */}
        <Input
          type="text"
          placeholder="Enter form name..."
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className="w-full mb-4 bg-gray-800 border border-gray-700 text-white p-2 rounded"
        />

        {/* Start Block */}
        <div className="p-4 bg-gray-800 text-white rounded-lg mb-4 flex items-center">
          <span className="mr-2">🚩</span> Start
        </div>

        {/* Fields Section */}
        {fields.map((field) => (
          <div key={field.id} className="p-4 bg-gray-800 text-white rounded-lg mb-4 flex items-center">
            <Input
              type="text"
              placeholder="Click here to edit"
              value={field.label || ""}
              onChange={(e) => updateField(field.id, "label", e.target.value)}
              className="flex-grow bg-gray-900 text-white border-gray-700 p-2 rounded"
            />
            <Select
              value={field.type}
              onChange={(e) => updateField(field.id, "type", e.target.value)}
              options={fieldTypes}
              className="bg-gray-900 text-white border-gray-700 p-2 rounded ml-2"
            />
            <Button onClick={() => removeField(field.id)} className="ml-2 bg-red-600 px-3 py-1 rounded">
              Delete
            </Button>
          </div>
        ))}

        {/* Submit Button */}
        <Button onClick={handleSubmit} className="w-full bg-green-600 px-4 py-2 rounded">
          Submit Form
        </Button>
      </div>
    </div>
  );
}
