import { render, fireEvent, screen, waitFor } from '@testing-library/vue'
import Register from '@/components/Views/Register.vue'
import axios from 'axios'
import { vi } from 'vitest'

// Mock axios
vi.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock router
const push = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push })
}))

describe('Register.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders all input fields and button', () => {
    render(Register)
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument() // role for <select>
  })

  it('updates v-model when typing/selecting', async () => {
    render(Register)
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement
    const phoneInput = screen.getByPlaceholderText('Phone Number') as HTMLInputElement
    const usernameInput = screen.getByPlaceholderText('Username') as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement
    const roleSelect = screen.getByRole('combobox') as HTMLSelectElement

    await fireEvent.update(emailInput, 'test@example.com')
    await fireEvent.update(phoneInput, '1234567890')
    await fireEvent.update(usernameInput, 'Dolly')
    await fireEvent.update(passwordInput, 'password123')
    await fireEvent.update(roleSelect, 'Admin')

    expect(emailInput.value).toBe('test@example.com')
    expect(phoneInput.value).toBe('1234567890')
    expect(usernameInput.value).toBe('Dolly')
    expect(passwordInput.value).toBe('password123')
    expect(roleSelect.value).toBe('Admin')
  })

  it('shows error when API returns failure', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: false, message: 'User already exists' }
    })

    render(Register)
    await fireEvent.update(screen.getByPlaceholderText('Email'), 'test@example.com')
    await fireEvent.update(screen.getByPlaceholderText('Phone Number'), '1234567890')
    await fireEvent.update(screen.getByPlaceholderText('Username'), 'Dolly')
    await fireEvent.update(screen.getByPlaceholderText('Password'), 'password123')
    await fireEvent.update(screen.getByRole('combobox'), 'Admin')
    await fireEvent.click(screen.getByRole('button', { name: /register/i }))

    await screen.findByText('User already exists')
  })

  it('redirects to login on successful registration', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { success: true }
    })

    render(Register)
    await fireEvent.update(screen.getByPlaceholderText('Email'), 'test@example.com')
    await fireEvent.update(screen.getByPlaceholderText('Phone Number'), '1234567890')
    await fireEvent.update(screen.getByPlaceholderText('Username'), 'Dolly')
    await fireEvent.update(screen.getByPlaceholderText('Password'), 'password123')
    await fireEvent.update(screen.getByRole('combobox'), 'Admin')
    await fireEvent.click(screen.getByRole('button', { name: /register/i }))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/login')
    })
  })

  it('handles network error gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'))

    render(Register)
    await fireEvent.update(screen.getByPlaceholderText('Email'), 'test@example.com')
    await fireEvent.update(screen.getByPlaceholderText('Phone Number'), '1234567890')
    await fireEvent.update(screen.getByPlaceholderText('Username'), 'Dolly')
    await fireEvent.update(screen.getByPlaceholderText('Password'), 'password123')
    await fireEvent.update(screen.getByRole('combobox'), 'Admin')
    await fireEvent.click(screen.getByRole('button', { name: /register/i }))

    await screen.findByText('❌ Registration failed. See console.')
  })
})
