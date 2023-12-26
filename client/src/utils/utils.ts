export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return token;
};

export const initGoogleAuth = async (callback?: (response: any) => void) => {
  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: callback,
  });

  window.google.accounts.id.renderButton(document.getElementById("login-div"), {
    theme: "outline",
    size: "large",
  });

  // window.google.accounts.id.prompt();
};
