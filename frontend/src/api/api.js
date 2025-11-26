
const BASE_URL = "http://localhost:8000";

export async function checkPlagiarism(formData) {
  const res = await fetch(`${BASE_URL}/api/check`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to check plagiarism");
  }

  return await res.json();
}
