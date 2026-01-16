import './report.css'
import '@mdi/font/css/materialdesignicons.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', sendLogin);
  }
});

async function sendLogin(event: Event) {
  event.preventDefault();

  const emailInput = document.getElementById('email') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;

  if (!emailInput?.value || !passwordInput?.value) {
    alert('Bitte alle Pflichtfelder ausfüllen (E-Mail, Passwort)');
    return;
  }

  try {
    const success = await login(emailInput.value, passwordInput.value);
    if (!success) {
      throw new Error("Login unsuccessful");
    }
    console.log("Login successful!");
  } catch (error) {
    console.error('Error sending report:', error);
    alert(`Fehler beim Senden der Meldung: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
  }
}


export default async function login(email: string, password: string): Promise<boolean> {
  try {
    const res = await fetch("http://moepserver:8000/api/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "email": email, "password": password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("jwt_token", data.jwt_token);
      return true;
    } else {
      localStorage.setItem("jwt_token", "");
      return false;
    }
  } catch (err) {
    localStorage.setItem("jwt_token", "");
    console.error('Fetch error:', err);
    return false;
  }
}