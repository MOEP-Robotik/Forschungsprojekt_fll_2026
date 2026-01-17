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
    if (success[0]) {
      console.log("Login successful!");
      return;
    }
    console.log(success)
    throw new Error(success[1]);
  } catch (error) {
    console.error('Error sending report:', error);
    alert(`Fehler beim Senden der Meldung: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
  }
}


export default async function login(email: string, password: string): Promise<[boolean, string]> {
  try {
    const res = await fetch("http://localhost:8000/api/auth/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "email": email, "password": password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("jwt_token", data.jwt_token);
      return [true, ""];
    } else {
      localStorage.setItem("jwt_token", "");
      console.log("Login unsuccessful: ", data);
      return [false, data.data.message];
    }
  } catch (err) {
    localStorage.setItem("jwt_token", "");
    console.error('Fetch error:', err);
    return [false, ""];
  }
}