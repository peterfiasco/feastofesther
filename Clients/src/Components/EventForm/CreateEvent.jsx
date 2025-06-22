import React from "react";
import EventForm from "./EventForm";

const CreateEvent = () => {
  const handleCreate = async (formData) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        body: formData, // Send the form data as `multipart/form-data`
      });
      const result = await response.json();
      if (response.ok) {
        alert("Event created successfully!");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div>
      <h1>Create Event</h1>
      <EventForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateEvent;
