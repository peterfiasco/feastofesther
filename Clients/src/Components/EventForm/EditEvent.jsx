import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventForm from "./EventForm";

const EditEvent = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${id}`);
        const result = await response.json();
        if (response.ok) {
          setEventData(result);
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "PUT",
        body: formData, // Send the form data as `multipart/form-data`
      });
      const result = await response.json();
      if (response.ok) {
        alert("Event updated successfully!");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  if (!eventData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Event</h1>
      <EventForm onSubmit={handleUpdate} initialData={eventData} isEdit />
    </div>
  );
};

export default EditEvent;
