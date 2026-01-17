import './account.css'
import './report.css'
import '@mdi/font/css/materialdesignicons.min.css';
import getApiEndpoint from './settings.ts';

document.addEventListener('DOMContentLoaded', async () => {
  const isLoggedIn = !!localStorage.getItem("jwt_token");
  const loginForm = document.getElementById('login-form');
  const accountWrapper = document.getElementById("account-wrapper");
  if (loginForm && accountWrapper) {
    loginForm.addEventListener('submit', sendLogin);
    if (!isLoggedIn) {
      loginForm.innerHTML = `
        <p>Ihre E-Mail: <span style="color:red;">*</span></p> <input type="email" placeholder="max.mustermann@example.de" id="email" name="email" required />
        <p>Passwort: <span style="color:red;">*</span></p> <input type="password" placeholder="********" id="password" name="password" required />
        <br/>
        <button type="submit">Einloggen</button>
      `;
    } else {
      let accountInfo = await getAccountInfo();
      if (accountInfo !== false){
        accountWrapper.innerHTML = `
          <p>Ihr Name: ${accountInfo.vorname + " " + accountInfo.nachname}</p>
          <p>Ihre E-Mail: ${accountInfo.email}</p>
          <p>Ihre Postleitzahl: ${accountInfo.plz}</p>
          <p>Ihre Telefonnummer: ${accountInfo.telefonnummer}</p>
        `;
      } else {
        alert("Es trat leider ein Problem auf. Bitte versuchen Sie es später erneut :(")
      }
    }
  }
  const splitter = document.getElementById("login-register-split");
  if (splitter && isLoggedIn) {
    splitter.style.display = "none";
  }
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', sendRegister);
    if (!isLoggedIn) {
      registerForm.innerHTML = `
        <p>Vorname: <span style="color:red;">*</span></p> 
        <input type="text" placeholder="Max" id="vorname" name="vorname" required />

        <p>Nachname: <span style="color:red;">*</span></p> 
        <input type="text" placeholder="Mustermann" id="nachname" name="nachname" required />

        <p>Ihre E-Mail: <span style="color:red;">*</span></p> 
        <input type="email" placeholder="max.mustermann@example.de" id="register-email" name="email" required />

        <p>Passwort: <span style="color:red;">*</span></p> 
        <input type="password" placeholder="********" id="register-password" name="password" required />

        <p>PLZ: <span style="color:red;">*</span></p> 
        <input type="text" placeholder="12345" id="plz" name="plz" required />

        <p>Telefonnummer: <span style="color:red;">*</span></p> 
        <input type="text" placeholder="+49 123 4567890" id="telefonnummer" name="telefonnummer" required />

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

export async function login(email: string, password: string): Promise<[boolean, string]> {
  try {
    const res = await fetch(`${getApiEndpoint()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ "email": email, "password": password }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("jwt_token", data.data.jwt_token);
      return [true, ""];
    } else {
      localStorage.setItem("jwt_token", "");
      console.log("Login unsuccessful: ", data);
      return [false, data.data?.message || "Unbekannter Fehler"];
    }
  } catch (err) {
    localStorage.setItem("jwt_token", "");
    console.error('Fetch error:', err);
    return [false, ""];
  }
}

async function sendRegister(event: Event) {
  event.preventDefault();

  const vornameInput = document.getElementById('vorname') as HTMLInputElement | null;
  const nachnameInput = document.getElementById('nachname') as HTMLInputElement | null;
  const passwordInput = document.getElementById('register-password') as HTMLInputElement | null;
  const plzInput = document.getElementById('plz') as HTMLInputElement | null;
  const emailInput = document.getElementById('register-email') as HTMLInputElement | null;
  const telefonnummerInput = document.getElementById('telefonnummer') as HTMLInputElement | null;

  if (
    !vornameInput?.value ||
    !nachnameInput?.value ||
    !emailInput?.value ||
    !passwordInput?.value ||
    !plzInput?.value ||
    !telefonnummerInput?.value
  ) {
    alert('Bitte alle Pflichtfelder ausfüllen (Vorname, Nachname, E-Mail, Passwort, PLZ)');
    return;
  }

  try {
    const success = await register(
      vornameInput.value,
      nachnameInput.value,
      passwordInput.value,
      plzInput.value,
      emailInput.value,
      telefonnummerInput?.value || "",
      []
    );
    if (success[0]) {
      console.log("Registration successful!");
      return;
    }
    console.log(success);
    throw new Error(success[1]);
  } catch (error) {
    console.error('Error sending registration:', error);
    alert(`Fehler bei der Registrierung: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
  }
}

export async function register(
  vorname: string,
  nachname: string,
  password: string,
  plz: string,
  email: string,
  telefonnummer: string,
  funde: number[] = []
) {
  try {
    const res = await fetch(`${getApiEndpoint()}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vorname,
        nachname,
        password,
        plz,
        email,
        telefonnummer,
        funde
      }),
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("jwt_token", data.data.jwt_token);
      return [true, ""];
    } else {
      localStorage.setItem("jwt_token", "");
      console.log("Registration unsuccessful: ", data);
      return [false, data.data?.message || "Unbekannter Fehler"];
    }
  } catch (err) {
    localStorage.setItem("jwt_token", "");
    console.error('Fetch error during registration:', err);
    return [false, ""];
  }
}

interface userinfo{
  vorname: string;
  nachname: string;
  plz: number;
  email: string;
  telefonnummer: string;
  funde: Array<number>;
}

export async function getAccountInfo(): Promise<userinfo | false>  {
  const jwt_token = localStorage.getItem("jwt_token");
  try {
    const res = await fetch(`${getApiEndpoint()}/api/auth/userinfo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jwt_token
      }),
    });

    const data = await res.json();
    let userInfo: userinfo = {
      vorname: data.data.vorname || "",
      nachname: data.data.nachname || "",
      plz: data.data.plz || 0,
      email: data.data.email || "",
      telefonnummer: data.data.telefonnummer || "",
      funde: data.data.funde || []
    };
    if (data.success) {
      return userInfo;
    } else {
      console.warn("getAccountInfo Problem: ", data);
      return false;
    }
  } catch (err) {
    console.error('Fetch error during getAccountInfo:', err);
    return false;
  }
}