import './account.css'
import './report.css'
import '@mdi/font/css/materialdesignicons.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem("jwt_token") !== "";
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', sendLogin);
    if (!isLoggedIn) {
      loginForm.innerHTML = `
        <p>Ihre E-Mail: <span style="color:red;">*</span></p> <input type="email" placeholder="max.mustermann@example.de" id="email" name="email" required />
        <p>Passwort: <span style="color:red;">*</span></p> <input type="password" placeholder="********" id="password" name="password" required />
        <br/>
        <button type="submit">Einloggen</button>
      `;
    }
  }
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', sendLogin);
    if (!isLoggedIn) {
      registerForm.innerHTML = `
        <p>Ihre E-Mail: <span style="color:red;">*</span></p> <input type="email" placeholder="max.mustermann@example.de" id="email" name="email" required />
        <p>Passwort: <span style="color:red;">*</span></p> <input type="password" placeholder="********" id="password" name="password" required />
        <br/>
        <button type="submit">Registrieren</button>
      `;
    }
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