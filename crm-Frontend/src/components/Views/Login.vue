<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">CRM Login</h2>
      <form @submit.prevent="login">
        <!-- Username -->
        <div class="input-group">
          <span class="icon">👤</span>
          <input v-model="username" id = "username"type="text" placeholder="Username" required />
        </div>

        <!-- Password -->
        <div class="input-group">
          <span class="icon">🔒</span>
          <input v-model="password" id = "password" type="password" placeholder="Password" required />
        </div>

        <!-- Submit -->
        <button type="submit" id = "submit" class="login-btn">Login</button>

        <!-- Error -->
        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>

      <div class="extra-links">
        <router-link to="/register" id ="register_link">Register / Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

// form values
const username = ref<string>("");
const password = ref<string>("");
const error = ref<string>("");

const router = useRouter();

// expected response structure
interface LoginResponse {
  role: string;
  token?: string;
  message?: string;
  success?: boolean;
}

const login = async (): Promise<void> => {
  try {
    const payload = { username: username.value, password: password.value };

    const res = await axios.post<LoginResponse>(
      "https://localhost:7270/api/Auth/Login", // 🔑 backend API endpoint
      payload
    );

    console.log(payload);

    if (res.data?.success) {
      // ✅ success alert
      alert("✅ Logged in successfully!");
      console.log(res.data.token);
      localStorage.setItem("token", res.data.token ?? "");
  localStorage.setItem("role", res.data.role ?? "");

  // redirect based on role
  if (res.data.role === "Admin") {
    router.push("/admin");
  } else if (res.data.role === "SalesRep") {
    router.push("/sales");
  } else if (res.data.role === "SupportUser") {
    router.push("/support");
  }

      // save token if you want to use later
      // localStorage.setItem("token", res.data.token ?? "");

      // redirect user
      //router.push("/");
    } else {
      error.value = res.data?.message ?? "Invalid credentials";
    }
  } catch (err: unknown) {
    error.value = "Login failed. Check console for details.";
    console.error(err);
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #2563eb, #9333ea);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.login-card {
  background: #fff;
  padding: 2rem;
  width: 350px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: fadeIn 0.8s ease-in-out;
}

.title {
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  color: #1f2937;
  font-weight: 600;
}

.input-group {
  position: relative;
  margin-bottom: 1rem;
}

.input-group .icon {
  position: absolute;
  left: 20px;
  top: 43%;
  transform: translateY(-50%);
}

.input-group input {
  width: 80%;
  padding: 10px 10px 10px 35px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border 0.3s;
}

.input-group input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 4px rgba(37, 99, 235, 0.4);
}

.login-btn {
  width: 100%;
  padding: 12px;
  margin-top: 0.5rem;
  background: linear-gradient(90deg, #2563eb, #9333ea);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}

.login-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.error-msg {
  color: #dc2626;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.extra-links {
  margin-top: 1.5rem;
}

.extra-links a {
  font-size: 0.95rem;
  color: #2563eb;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.extra-links a:hover {
  color: #9333ea;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
