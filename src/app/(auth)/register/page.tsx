"use client"; // Diz ao Next.js que essa página é cliente e pode usar estados e eventos

import { useState } from "react"; // Importa o hook useState para controlar dados do formulário

// Componente da página de registro (cadastro)
export default function RegisterPage() {
  // Criamos estados para guardar os valores que o usuário digita
  const [name, setName] = useState(""); // Estado para o nome
  const [email, setEmail] = useState(""); // Estado para o email
  const [password, setPassword] = useState(""); // Estado para a senha

  // Função chamada quando o formulário for enviado
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault(); // Evita que a página recarregue ao enviar o formulário

    // Por enquanto, só mostramos no console o que o usuário digitou
    console.log({ name, email, password });

    // Aqui depois vamos conectar com o backend para realmente criar o usuário no banco
  }

  // JSX que será renderizado na tela
  return (
    <main className="max-w-md mx-auto mt-20 p-4 border rounded shadow">
      {/* Título da página */}
      <h1 className="text-2xl font-bold mb-4">Cadastro</h1>

      {/* Formulário de cadastro */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Campo para nome */}
        <input
          type="text"
          placeholder="Nome"
          value={name} // Valor atual do input
          onChange={(e) => setName(e.target.value)} // Atualiza o estado ao digitar
          className="border p-2 rounded"
          required // Campo obrigatório
        />

        {/* Campo para email */}
        <input
          type="email"
          placeholder="E-mail"
          value={email} // Valor atual do input
          onChange={(e) => setEmail(e.target.value)} // Atualiza o estado ao digitar
          className="border p-2 rounded"
          required // Campo obrigatório
        />

        {/* Campo para senha */}
        <input
          type="password"
          placeholder="Senha"
          value={password} // Valor atual do input
          onChange={(e) => setPassword(e.target.value)} // Atualiza o estado ao digitar
          className="border p-2 rounded"
          required // Campo obrigatório
          minLength={6} // Senha deve ter no mínimo 6 caracteres
        />

        {/* Botão para enviar o formulário */}
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Cadastrar
        </button>
      </form>
    </main>
  );
}
