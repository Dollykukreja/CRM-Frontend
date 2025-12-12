import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import SalesRepDashboard from '@/components/Views/Salesdashboard.vue'
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
const mockedApi = api as any  // TypeScript cast to access .mockResolvedValueOnce

describe('SalesRepDashboard.vue', () => {

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders header, buttons, tiles, and welcome text', () => {
    render(SalesRepDashboard)

    // Header buttons
    expect(screen.getByRole('button', { name: /customers/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()

    // Welcome text
    expect(screen.getByText(/welcome, sales rep/i)).toBeInTheDocument()
    expect(screen.getByText(/add/i)).toBeInTheDocument()
expect(screen.getByText(/edit/i)).toBeInTheDocument()

    // Tile title
    expect(screen.getByText(/total customers/i)).toBeInTheDocument()
  })

  it('fetches and displays total customers', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: { total: 25 } })

    render(SalesRepDashboard)

    await waitFor(() => {
      expect(screen.getByText('25')).toBeInTheDocument()
    })
  })

  it('navigates to customers page when Customers button is clicked', async () => {
    render(SalesRepDashboard)

    const btn = screen.getByRole('button', { name: /customers/i })
    await fireEvent.click(btn)

    expect(push).toHaveBeenCalledWith('/customers')
  })

  it('clears localStorage and navigates to login when Logout button is clicked', async () => {
    localStorage.setItem('token', 'abc')
    localStorage.setItem('role', 'SalesRep')

    render(SalesRepDashboard)

    const btn = screen.getByRole('button', { name: /logout/i })
    await fireEvent.click(btn)

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('role')).toBeNull()
    expect(push).toHaveBeenCalledWith('/login')
  })

  it('handles API failure gracefully', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('API Error'))

    render(SalesRepDashboard)

    await waitFor(() => {
      // Total customers should remain 0
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })
})
