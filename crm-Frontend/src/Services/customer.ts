// src/services/customer.ts
import api from "./api";

export interface Contact {
  type: "Email" | "Phone";
  value: string;
}
export interface Customer {
  emails: string[];
  phone: string[];
  id: number;
  name: string;
  contacts: Contact[];
  address: string;
  company: string;
  createdAt: string;
}
const API_URL = "https://localhost:7270/api/Customers/totalCustomers";

export async function getCustomers(search = "", page = 1, pageSize = 50) {
  const res = await api.get<Customer[]>("/customers", { params: { search, page, pageSize } });
  return res.data;
}

export async function getCustomer(id: number) {
  const res = await api.get<Customer>(`/customers/${id}`);
  return res.data;
}

export async function createCustomer(payload: Omit<Customer, "id" | "createdAt">) {
  const res = await api.post("/customers", payload);
  return res.data;
}

export async function updateCustomer(id: number, payload: Partial<Customer>) {
  await api.put(`/customers/${id}`, payload);
}

export async function deleteCustomer(id: number) {
  await api.delete(`/customers/${id}`);
}
