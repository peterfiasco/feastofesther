export const submitForm = async (formData) => {
  try {
    const response = await fetch(
      "https://nodejs.feastofestherna.com/api/v1/submit-form",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      const result = await response.json();
      alert("Form submitted successfully: " + result.message);
    } else {
      const errorResult = await response.json();
      alert("Error: " + errorResult.error);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("An error occurred while submitting the form.");
  }
};
