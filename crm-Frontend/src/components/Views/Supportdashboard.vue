<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <!-- Customers button before logout -->
      <button @click="goToCustomers" id="customerbtn" class="customers-btn">👥 Customers</button>
      <button @click="logout" id="logoutbtn" class="logout-btn">Logout</button>
    </header>

    <main class="dashboard-content">
       <!-- Total Customers Tile -->
      <h1>Welcome, Support User 🎧</h1>
      <p>This is your Support Dashboard.</p>
      <div class="dashboard-grid">
        <div class="tile" style="background-color: #3b82f6;">
          <div class="tile-content">
            <h3 class="tile-title">Total Customers</h3>
            <p class="tile-value">{{ totalCustomers }}</p>
          </div>
          <div class="tile-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M12 12a4 4 0 100-8 4 4 0 000 8z"/>
            </svg>
          </div>
        </div>
      </div>

      
    </main>
  </div>
</template>

<script setup lang="ts">
import{onMounted, ref} from "vue";
import { useRouter } from "vue-router";
import api from "@/Services/api";

const router = useRouter();
const totalCustomers = ref(0);

const logout = () => {
  localStorage.clear();
  router.push("/login");
};

const goToCustomers = () => {
  router.push("/customers");
};

// Fetch total customers count
const loadTotalCustomers = async () => {
  try {
    const res = await api.get<{ total: number }>("customers/totalCustomers");
    totalCustomers.value = res.data.total;
  } catch (err) {
    console.error("Failed to load total customers", err);
  }
};

onMounted(() => {
  loadTotalCustomers();
});
</script>

<style scoped>
.dashboard-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
}

.dashboard-header {
  display: flex;
  justify-content: flex-end; /* align items to right */
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: #2563eb;
  color: white;
}

.customers-btn {
  background: #10b981;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  font-weight: bold;
}
.customers-btn:hover {
  background: #059669;
}

.logout-btn {
  background: #ef4444;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  font-weight: bold;
}
.logout-btn:hover {
  background: #dc2626;
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
}

/* Tile styling */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  justify-items: center;
  margin-bottom: 2rem;
}

.tile {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}
.tile:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.2);
}
.tile-title {
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.85;
}
.tile-value {
  font-size: 2rem;
  font-weight: 700;
}
.tile-icon svg {
  height: 2rem;
  width: 2rem;
}
</style>
