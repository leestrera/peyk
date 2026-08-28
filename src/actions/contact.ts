"use server";

export async function submitContactProtocol(formData: FormData) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  // Basic validation mock
  if (!name || !email) {
    return {
      success: false,
      message: "Required fields missing. Connection refused.",
    };
  }

  // Here you would normally integrate with Resend, Supabase, etc.
  // For now, we return a mock success state.
  return {
    success: true,
    message: "Protocol initialized. Your transmission has been securely logged.",
  };
}
