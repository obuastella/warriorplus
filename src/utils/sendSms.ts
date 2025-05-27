export const sendSms = async (to: string, message: string) => {
  try {
    const res = await fetch("http://localhost:4000/send-sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, message }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    const data = await res.json();
    console.log("SMS sent:", data);
  } catch (err) {
    console.error("Error sending SMS:", err);
  }
};
