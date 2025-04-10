import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState(""); // Novo estado para cidade
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const res = await fetch("http://3.88.101.123:8080/api/interests");
        const data = await res.json();
        setInterests(data);
      } catch (err) {
        console.error("Erro ao carregar interesses:", err);
      }
    };

    fetchInterests();
  }, []);

  const handleCheckboxChange = (interestId) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const user = {
      name,
      email,
      region: city, // Enviado como 'region'
      interestIds: selectedInterests,
    };

    try {
      const response = await fetch("http://3.88.101.123:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setMessage("Usuário cadastrado com sucesso!");
        setEmail("");
        setName("");
        setCity(""); // Limpar cidade
        setSelectedInterests([]);
      } else {
        const errorText = await response.text();
        setMessage(errorText || "Erro no cadastro.");
      }
    } catch (error) {
      setMessage("Erro ao se comunicar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>MNews </h1>
      <h2>Sua newsletter personalizada</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Cidade"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <div className="interests">
          <strong>Selecione seus interesses:</strong>
          {interests.map((interest) => (
            <div key={interest.id} className="checkbox">
              <label>
                <input
                  type="checkbox"
                  value={interest.id}
                  checked={selectedInterests.includes(interest.id)}
                  onChange={() => handleCheckboxChange(interest.id)}
                />
                {interest.name}
              </label>
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default App;
