import { render, fireEvent, screen, waitFor } from '@testing-library/vue'
import Login from '@/components/Views/Login.vue'
import axios from 'axios'
import { vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'

// ✅ Mock axios
vi.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// ✅ Mock router
const push = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push })
}))

describe('Login.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders form fields and button', () => {
    render(Login)
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('updates username and password when typing', async () => {
    render(Login)
    const userInput = screen.getByPlaceholderText('Username') as HTMLInputElement
    await fireEvent.update(userInput, 'Dolly')
    expect(userInput.value).toBe('Dolly')
  })

  it('shows error when login fails', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: false, message: 'Invalid credentials' }
    })
    render(Login)
    await fireEvent.update(screen.getByPlaceholderText('Username'), 'test')
    await fireEvent.update(screen.getByPlaceholderText('Password'), 'wrong')
    await fireEvent.click(screen.getByRole('button', { name: /login/i }))
    await screen.findByText('Invalid credentials')
  })

  it('redirects and stores token when login succeeds (Admin)', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true, role: 'Admin', token: 'abc123' }
    })
    render(Login)
    await fireEvent.update(screen.getByPlaceholderText('Username'), 'admin')
    await fireEvent.update(screen.getByPlaceholderText('Password'), 'pass')
    await fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('abc123')
      expect(localStorage.getItem('role')).toBe('Admin')
      expect(push).toHaveBeenCalledWith('/admin')
    })
  })

  it('handles network error gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'))
    render(Login)
    await fireEvent.update(screen.getByPlaceholderText('Username'), 'user')
    await fireEvent.update(screen.getByPlaceholderText('Password'), '123')
    await fireEvent.click(screen.getByRole('button', { name: /login/i }))
    await screen.findByText('Login failed. Check console for details.')
  })
})
