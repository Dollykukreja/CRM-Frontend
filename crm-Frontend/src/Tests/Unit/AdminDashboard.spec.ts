import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import AdminDashboard from '@/components/Views/Admindashboard.vue'
import api from '@/Services/api'
import { vi } from 'vitest'

// Mock router
const push = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({ push })
}))

// Mock API
vi.mock('@/Services/api', () => ({
  default: {
    get: vi.fn()
  }
}))
const mockedApi = api as jest.Mocked<typeof api>

describe('AdminDashboard.vue', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders header, buttons, and welcome text', () => {
    render(AdminDashboard)
    
    expect(screen.getByRole('button', { name: /customers/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    expect(screen.getByText(/welcome, admin/i)).toBeInTheDocument()
    expect(screen.getByText(/click "customer list"/i)).toBeInTheDocument()
  })

  it('calls API and displays total customers', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: { total: 42 } })

    render(AdminDashboard)

    // Wait for the API call and DOM update
    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument()
    })
  })

  it('navigates to customers page when Customers button is clicked', async () => {
    render(AdminDashboard)
    
    const btn = screen.getByRole('button', { name: /customers/i })
    await fireEvent.click(btn)

    expect(push).toHaveBeenCalledWith('/customers')
  })

  it('clears localStorage and navigates to login when Logout button is clicked', async () => {
    localStorage.setItem('token', '123')
    localStorage.setItem('role', 'Admin')

    render(AdminDashboard)

    const btn = screen.getByRole('button', { name: /logout/i })
    await fireEvent.click(btn)

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('role')).toBeNull()
    expect(push).toHaveBeenCalledWith('/login')
  })

  it('handles API failure gracefully', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('API Error'))

    render(AdminDashboard)

    await waitFor(() => {
      // The totalCustomers tile should remain 0
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })
})
