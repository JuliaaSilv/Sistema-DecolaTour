import React, { useEffect, useState } from "react";
import Layout from "../layouts/Layout.jsx";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";

// Simulação de dados (substitua por chamadas à API)
const metricasGerais = [
  { label: "Reservas", value: 120 },
  { label: "Faturamento", value: "R$ 85.000" },
  { label: "Clientes", value: 45 },
  { label: "Pacotes", value: 12 },
];

const faturamentoMensal = [
  { mes: "Jan", valor: 12000 },
  { mes: "Fev", valor: 9000 },
  { mes: "Mar", valor: 15000 },
  { mes: "Abr", valor: 18000 },
  { mes: "Mai", valor: 11000 },
  { mes: "Jun", valor: 14000 },
];

const destinosPopulares = [
  { destino: "Rio de Janeiro", reservas: 40 },
  { destino: "Salvador", reservas: 30 },
  { destino: "Fortaleza", reservas: 25 },
  { destino: "Gramado", reservas: 15 },
];

const clientesFrequentes = [
  { nome: "João Silva", reservas: 8 },
  { nome: "Maria Souza", reservas: 6 },
  { nome: "Carlos Lima", reservas: 5 },
];

const avaliacoes = [
  { usuario: "João Silva", nota: 5, comentario: "Excelente!", data: "2025-07-10" },
  { usuario: "Maria Souza", nota: 4, comentario: "Muito bom!", data: "2025-07-08" },
  { usuario: "Carlos Lima", nota: 3, comentario: "Satisfatório.", data: "2025-07-05" },
];

export default function AdminPanel() {
  // Filtros e estados podem ser implementados conforme necessidade
  return (
    <Layout>
      <section className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {metricasGerais.map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <span className="text-lg font-semibold mb-2">{kpi.label}</span>
              <span className="text-2xl font-bold text-blue-600">{kpi.value}</span>
            </div>
          ))}
        </div>

        {/* Gráfico de faturamento mensal */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Faturamento Mensal</h2>
          <div className="flex gap-2 items-end h-40">
            {faturamentoMensal.map((item) => (
              <div key={item.mes} className="flex flex-col items-center justify-end h-full">
                <div
                  className="bg-blue-400 rounded w-8"
                  style={{ height: `${item.valor / 200}px` }}
                  title={`R$ ${item.valor}`}
                ></div>
                <span className="text-xs mt-2">{item.mes}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Destinos populares */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Destinos Populares</h2>
          <div className="flex gap-6">
            {destinosPopulares.map((dest) => (
              <div key={dest.destino} className="flex flex-col items-center">
                <span className="font-medium">{dest.destino}</span>
                <div
                  className="bg-orange-400 rounded w-10 mt-2"
                  style={{ height: `${dest.reservas * 3}px` }}
                  title={`${dest.reservas} reservas`}
                ></div>
                <span className="text-xs mt-2">{dest.reservas} reservas</span>
              </div>
            ))}
          </div>
        </div>

        {/* Clientes frequentes */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Clientes Frequentes</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-4">Nome</th>
                <th className="py-2 px-4">Reservas</th>
              </tr>
            </thead>
            <tbody>
              {clientesFrequentes.map((cli) => (
                <tr key={cli.nome} className="border-t">
                  <td className="py-2 px-4">{cli.nome}</td>
                  <td className="py-2 px-4">{cli.reservas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gestão CRUD - Links para páginas de gestão */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a href="/admin/pacotes" className="bg-blue-100 rounded-xl shadow p-6 flex flex-col items-center hover:bg-blue-200 transition">
            <span className="text-lg font-semibold mb-2">Gestão de Pacotes</span>
            <span className="text-sm text-blue-700">CRUD e filtros</span>
          </a>
          <a href="/admin/reservas" className="bg-green-100 rounded-xl shadow p-6 flex flex-col items-center hover:bg-green-200 transition">
            <span className="text-lg font-semibold mb-2">Gestão de Reservas</span>
            <span className="text-sm text-green-700">CRUD e filtros</span>
          </a>
          <a href="/admin/usuarios" className="bg-orange-100 rounded-xl shadow p-6 flex flex-col items-center hover:bg-orange-200 transition">
            <span className="text-lg font-semibold mb-2">Gestão de Usuários</span>
            <span className="text-sm text-orange-700">CRUD e filtros</span>
          </a>
        </div>

        {/* Botões de exportação */}
        <div className="flex gap-4 mb-8">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            <FaFileExcel /> Exportar Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            <FaFilePdf /> Exportar PDF
          </button>
        </div>

        {/* Avaliações e Comentários */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Avaliações e Comentários</h2>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-4">Usuário</th>
                <th className="py-2 px-4">Nota</th>
                <th className="py-2 px-4">Comentário</th>
                <th className="py-2 px-4">Data</th>
                <th className="py-2 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {avaliacoes.map((av, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 px-4">{av.usuario}</td>
                  <td className="py-2 px-4">{av.nota}</td>
                  <td className="py-2 px-4">{av.comentario}</td>
                  <td className="py-2 px-4">{av.data}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button className="px-2 py-1 bg-red-500 text-white rounded text-xs">Excluir</button>
                    <button className="px-2 py-1 bg-yellow-500 text-white rounded text-xs">Editar</button>
                    <button className="px-2 py-1 bg-green-500 text-white rounded text-xs">Aprovar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}