export default async function login(username: string, password: string): Promise<boolean> {
  try {
    const res = await fetch("http://moepserver:8000/api/", { //keine Ahnung wo gefetchet werden muss
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
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