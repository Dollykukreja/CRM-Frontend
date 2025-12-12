<template>
    <div class="unauthorized">
      <h1>401 - Unauthorized</h1>
      <p>You don’t have permission to access this page.</p>
      <router-link to="/">Go to Login</router-link>
    </div>
  </template>
  
  <style scoped>
  .unauthorized {
    text-align: center;
    margin-top: 5rem;
    color: #dc2626;
  }
  </style>
  