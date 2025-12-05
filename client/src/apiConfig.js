// Yeh automatic check karega:
// Agar aap local computer par ho -> localhost use karega
// Agar aap Vercel par live ho -> Render ka URL use karega

const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default apiUrl;