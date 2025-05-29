// lib/db.ts
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import type { Database } from "sqlite";

// Função para abrir o banco de dados SQLite
export async function openDb(): Promise<Database> {
  return open({
    filename: "./db.sqlite", // nome do arquivo do banco
    driver: sqlite3.Database,
  });
}
