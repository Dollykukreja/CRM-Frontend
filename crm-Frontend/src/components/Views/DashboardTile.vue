<template>
    <div class="dashboard-tile" @click="goToCustomers">
      <div class="tile-header">
        <h3>Total Customers</h3>
        <span class="icon">👥</span>
      </div>
      <div class="tile-count">{{ totalCustomers }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import api from "@/Services/api"; // Axios instance
  
  const router = useRouter();
  const totalCustomers = ref<number>(0);
  
  // Fetch total customers from backend
  const loadTotalCustomers = async () => {
    try {
      const res = await api.get("/Customers/total"); // Make sure backend has this endpoint
      totalCustomers.value = res.data.total ?? 0;
    } catch (err) {
      console.error("Failed to fetch total customers", err);
    }
  };
  
  onMounted(() => {
    loadTotalCustomers();
  });
  
  const goToCustomers = () => {
    router.push({path: "/customers"});
  };
  </script>
  
  <style scoped>
  .dashboard-tile {
    background: linear-gradient(135deg, #2563eb, #9333ea);
    color: white;
    padding: 1.5rem;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 200px;
    text-align: center;
  }
  
  .dashboard-tile:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
  
  .tile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .tile-header h3 {
    font-size: 1rem;
    font-weight: 600;
  }
  
  .tile-header .icon {
    font-size: 1.5rem;
  }
  
  .tile-count {
    margin-top: 1rem;
    font-size: 2rem;
    font-weight: bold;
  }
  </style>
   