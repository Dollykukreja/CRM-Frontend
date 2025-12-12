import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import SupportDashboard from '@/components/Views/Supportdashboard.vue'
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
const mockedApi = api as any  // cast to access .mockResolvedValueOnce

describe('SupportDashboard.vue', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders header buttons, tile, and welcome text', () => {
    render(SupportDashboard)

    // Header buttons
    expect(screen.getByRole('button', { name: /customers/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()

    // Welcome text
    expect(screen.getByText(/welcome, support user/i)).toBeInTheDocument()
    expect(screen.getByText(/this is your support dashboard/i)).toBeInTheDocument()

    // Tile title
    expect(screen.getByText(/total customers/i)).toBeInTheDocument()
  })

  it('fetches and displays total customers', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: { total: 15 } })

    render(SupportDashboard)

    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument()
    })
  })

  it('navigates to customers page when Customers button is clicked', async () => {
    render(SupportDashboard)

    const btn = screen.getByRole('button', { name: /customers/i })
    await fireEvent.click(btn)

    expect(push).toHaveBeenCalledWith('/customers')
  })

  it('clears localStorage and navigates to login when Logout button is clicked', async () => {
    localStorage.setItem('token', 'xyz')
    localStorage.setItem('role', 'SupportUser')

    render(SupportDashboard)

    const btn = screen.getByRole('button', { name: /logout/i })
    await fireEvent.click(btn)

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('role')).toBeNull()
    expect(push).toHaveBeenCalledWith('/login')
  })

  it('handles API failure gracefully', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('API Error'))

    render(SupportDashboard)

    await waitFor(() => {
      // Total customers should remain 0
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })
})
