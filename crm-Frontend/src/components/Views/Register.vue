<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="title">CRM Register</h2>
      <form @submit.prevent="register">

        <!-- Email -->
        <div class="input-group">
          <span class="icon">📧</span>
          <input v-model="email" id = "email" type="email" placeholder="Email" required />
        </div>

        <!-- Phone -->
        <div class="input-group">
          <span class="icon">📱</span>
          <input v-model="phoneNumber" id="phoneNumber" type="tel" placeholder="Phone Number" required />
        </div>

        <!-- Username -->
        <div class="input-group">
          <span class="icon">👤</span>
          <input v-model="username" id= "username" type="text" placeholder="Username" required />
        </div>

        <!-- Password -->
        <div class="input-group">
          <span class="icon">🔒</span>
          <input v-model="password" id ="password" type="password" placeholder="Password" required />
        </div>

        <!-- Role -->
        <div class="input-group">
          <span class="icon">⚙️</span>
          <select v-model="role" id ="role"required>
            <option disabled value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="salesRep">Sales Rep</option>
            <option value="supportUser">Support User</option>
  
          </select>
        </div>

        <!-- Submit -->
        <button type="submit" id="submit" class="login-btn">Register</button>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </form>

      <div class="extra-links">
        <router-link to="/login" id = "already_login">Already have an account? Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "vue-router";

// Payload type
interface RegisterPayload {
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
  role: "Admin" | "SalesRep" | "SupportUser";
}

// Response type
interface RegisterResponse {
  success: boolean;
  message?: string;
}

// Reactive state
const email = ref<string>("");
const phoneNumber = ref<string>("");
const username = ref<string>("");
const password = ref<string>("");
const role = ref<RegisterPayload["role"] | "">("");
const error = ref<string>("");

const router = useRouter();

// Register function
const register = async (): Promise<void> => {
  try {
     // Step 1: Check if email already exists
    const existingUserRes = await axios.get(
     `https://localhost:7270/api/Auth/CheckEmail?email=${encodeURIComponent(email.value)}`
    );

    if (existingUserRes.data.exists) {
      error.value = "❌ Email already registered. Please use a different email.";
      return;
      // stop registration
    }
    const payload: RegisterPayload = {
      email: email.value,
      phoneNumber: phoneNumber.value,
      username: username.value,
      password: password.value,
      role: role.value as RegisterPayload["role"],
    };

    const res: AxiosResponse<RegisterResponse> = await axios.post(
      "https://localhost:7270/api/Auth/Register",
      payload
    );

    if (res.data.success) {
      alert("✅ Registered successfully");
      router.push("/login");
    } else {
      error.value = res.data.message ?? "❌ Registration failed";
    }
  } catch (err: unknown) {
    error.value = "❌ Registration failed. See console.";
    console.error(err);
  }
};
</script>

<style scoped>
/* same styles as before */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #2563eb, #9333ea);
}
.login-card {
  background: #fff;
  padding: 2rem;
  width: 350px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
}
.title {
  margin-bottom: 1.2rem;
  font-size: 1.6rem;
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
.input-group input,
.input-group select {
  width: 80%;
  padding: 10px 10px 10px 35px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
}
.login-btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  background: linear-gradient(90deg, #2563eb, #9333ea);
  color: #fff;
  border: none;
}
.error-msg {
  color: #dc2626;
  margin-top: 0.8rem;
}
.extra-links {
  margin-top: 1rem;
}
.input-group select {
  width: 95%;
}
</style>
