<template>
  <div class="page">
    <header class="header">
      <input
        v-model="search"
        @input="onSearchInput"
        placeholder="Search customers..."
        class="search"
      />
      <div>
        <!-- Add button: visible for Admin and Sales -->
        <button v-if="isAdmin || isSales" id="addcustomer" @click="openCreate" class="btn">
          + Add Customer
        </button>
      </div>
    </header>

    <main>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Address</th>
            <th v-if="isAdmin || isSales">Actions</th>
          </tr>
        </thead>
          <tbody>
          <tr v-for="c in customers" :key="c.id">
            <td>{{ c.name }}</td>
            <td>
              {{
                c.contacts.find((contact) => contact.type === "Email")?.value
              }}
            </td>
            <td>
              {{
                c.contacts.find((contact) => contact.type === "Phone")?.value
              }}
            </td>
            <td>{{ c.company }}</td>
            <td>{{ c.address }}</td>
             

            <td v-if="isAdmin || isSales">
              <!-- Edit available to both -->
              <button id="editbtn" @click="openEdit(c)" class="btn small">Edit</button>
                <button @click="viewContacts(c.contacts)" class="btn small">View</button>
              <!-- Delete only for Admin -->
              <button
                v-if="isAdmin"
                @click="openDeleteModal(c)"
                class="btn small danger"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="customers.length === 0" class="empty">No customers found.</div>
    </main>
    <!-- Delete Confirmation Modal -->
<div v-if="showDeleteModal" class="modal">
  <div class="modal-content">
    <h3>Confirm Deletion</h3>
    <p>Are you sure you want to delete <strong>{{ deletingCustomerName }}</strong>?</p>
    <div class="modal-actions">
      <button id= "deletebtn" class="btn danger" @click="confirmDelete">Delete</button>
      <button id = "cancelbtn" class="btn" @click="showDeleteModal = false">Cancel</button>
    </div>
  </div>
</div>


    <!-- Create / Edit Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ editing ? "Edit Customer" : "Add Customer" }}</h3>
        <form @submit.prevent="saveCustomer">
          <label>Name</label>
          <input id="name"v-model="form.name" placeholder="Name" required />
          <!-- <button type="submit">Save</button> -->
          <!-- Emails -->
          <div>
            <label>Emails</label>
            <div
              v-for="(email, i) in form.email"
              :key="i"
              style="display: flex; gap: 8px; margin-bottom: 6px"
            >
              <input
                v-model="form.email[i]"
                :id="'email_' + i"
                type="email"
                placeholder="Email"
                required
              />
              <button
                type="button"
                @click="removeEmail(i)"
                class="btn small danger"
              >
                x
              </button>
            </div>
            <button type="button" id="addemail" @click="addEmail" class="btn small">
              + Add Email
            </button>
          </div>

          <!-- Phones -->
          <div style="margin-top: 12px">
            <label>Phones</label>
            <div
              v-for="(phone, i) in form.phone"
              :key="i"
              style="display: flex; gap: 8px; margin-bottom: 6px"
            >
              <input  :id= "'phone_'+ i" v-model="form.phone[i]" placeholder="Phone" />
              <button
                type="button"
                @click="removePhone(i)"
                class="btn small danger"
              >
                x
              </button>
            </div>
            <button type="button"id ="addphone" @click="addPhone" class="btn small">
              + Add Phone
            </button>
          </div>
          
          <!-- Company & Address -->
           <div style="margin-top: 12px">
          <label>Company</label>
          <input id = "company" v-model="form.company" placeholder="Company" />
          <label>Address</label>
          <input id="address" v-model="form.address" placeholder="Address" />
          </div>
          <!-- Actions -->
          <div class="modal-actions">
            <button id = "savebtn" type="submit" class="btn" >
              {{ editing ? "Save" : "Create" }}
            </button>
            <button id = "closebtn" type="button" class="btn" @click="closeModal">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
        <!-- View Contacts Modal -->
        <div v-if="showContactsModal" class="modal">
            <div class="modal-content">
              <h3>Contact Details</h3>
              <ul>
                <li v-for="(contact, index) in selectedContacts" :key="index">
                  {{ contact.type }}: {{ contact.value }}
                </li>
              </ul>
              <div class="modal-actions">
                <button id="closebtn" class="btn" @click="showContactsModal = false">
                  Close
                </button>
              </div>
            </div>
            </div>
            </div>
          </template>


<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  Customer,
  Contact,
} from "@/Services/customer";

const customers = ref<Customer[]>([]);
const search = ref("");
const page = ref(1);
const pageSize = ref(50);
let searchTimeout: number | undefined;

const role = localStorage.getItem("role") ?? "";
const isAdmin = role === "Admin";
const isSales = role === "SalesRep";
const isSupport = role === "Support";
const showContactsModal = ref(false);
const selectedContacts = ref<{ type: string; value: string }[]>([]);

async function load() {
  customers.value = await getCustomers(
    search.value,
    page.value,
    pageSize.value
  );
}

onMounted(load);

function onSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = window.setTimeout(() => {
    page.value = 1;
    load();
  }, 350);
}

const showModal = ref(false);
const editing = ref(false);
const editingId = ref<number | null>(null);
const form = ref({
  name: "",
  email: [""],
  phone: [""],
  company: "",
  address: "",
});

function openCreate() {
  editing.value = false;
  editingId.value = null;
  form.value = { name: "", email: [""], phone: [""], company: "", address: "" };
  showModal.value = true;
}

function openEdit(c: Customer) {
  editing.value = true;
  editingId.value = c.id;
  form.value = {
    name: c.name,
    email: Array.isArray(c.emails) ? c.emails : [c.emails || ""],
    phone: Array.isArray(c.phone) ? c.phone : [c.phone || ""],
    company: c.company,
    address: c.address,
  };

  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}
function viewContacts(contacts: Contact[]) {
  selectedContacts.value = contacts;
  showContactsModal.value = true;
}
// async function saveCustomer() {
//   if (editing.value && editingId.value) {
//     await updateCustomer(editingId.value, {
//       ...form.value,
//       phone: form.value.phone as string[] // Ensure phone is of type string[]
//     });
//   } else {
//     await createCustomer(form.value as any);
//   }
//   closeModal();
//   await load();
// }
async function saveCustomer() {
  const contacts = [
    ...form.value.email.map((e) => ({ type: "Email" as const, value: e })),
    ...form.value.phone.map((p) => ({ type: "Phone" as const, value: p })),
  ];

  const payload = {
    name: form.value.name,
    company: form.value.company,
    address: form.value.address,
    emails: form.value.email[0] || "N/A", // first email for legacy field
    phone: form.value.phone[0] || "N/A", // first phone for legacy field
    contacts,
  };

  if (editing.value && editingId.value) {
    await updateCustomer(editingId.value, {
      ...payload,
      emails: [form.value.email[0] || ""], // wrap in an array
      phone: [form.value.phone[0] || ""], // wrap in an array
    });
  } else {
    await createCustomer({
      ...payload,
      emails: [form.value.email[0] || ""], // wrap in an array
      phone: [form.value.phone[0] || ""], // wrap in an array
    });
  }

  closeModal();
  await load();
}
const showDeleteModal = ref(false);
const deletingCustomerId = ref<number | null>(null);
const deletingCustomerName = ref("");

function openDeleteModal(customer: Customer) {
  deletingCustomerId.value = customer.id;
  deletingCustomerName.value = customer.name;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!deletingCustomerId.value) return;
  await deleteCustomer(deletingCustomerId.value);
  showDeleteModal.value = false;
  await load();
}


async function removeCustomer(id: number) {
  if (!confirm("Are you sure you want to delete this customer?")) return;
  await deleteCustomer(id);
  await load();
}
function addEmail() {
  form.value.email.push("");
}
function removeEmail(i: number) {
  form.value.email.splice(i, 1);
}
function addPhone() {
  form.value.phone.push("");
}
function removePhone(i: number) {
  form.value.phone.splice(i, 1);
}
</script>
<style scoped>
.page {
  padding: 1.5rem;
  background: #f9fafb;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search {
  padding: 0.6rem 1rem;
  width: 280px;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  outline: none;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.search:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
}

/* Buttons */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
  margin: 0 0.2rem;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
}

.btn.small {
  padding: 0.4rem 0.8rem;
}

.btn.danger {
  background: #ef4444;
  color: white;
}

.btn.danger:hover {
  background: #dc2626;
}

.btn:not(.danger) {
  background: linear-gradient(90deg, #2563eb, #9333ea);
  color: white;
}

/* Table */
.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.table th,
.table td {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.9rem;
}

.table th {
  background: #f3f4f6;
  color: #374151;
  font-weight: 700;
}

.table tr:hover td {
  background: #f9fafb;
}

.empty {
  text-align: center;
  margin-top: 1.5rem;
  color: #6b7280;
  font-style: italic;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  max-width: 95%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

.modal-content h3 {
  margin-bottom: 1rem;
  color: #1f2937;
}

.modal-content input {
  display: block;
  width: 100%;
  padding: 0.6rem 1rem;
  margin-bottom: 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s;
}

.modal-content input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
