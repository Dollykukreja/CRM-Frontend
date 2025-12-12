import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import DashboardTile from '@/components/Views/DashboardTile.vue'
import { vi } from 'vitest'
import { createRouter, createWebHistory } from 'vue-router'
import api from '@/Services/api'

// Mock the API module
vi.mock('@/Services/api', () => ({
  default: {
    get: vi.fn(),
  },
}))

// Mock Vue Router
const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

describe('DashboardTile.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title and icon', async () => {
    (api.get as any).mockResolvedValue({ data: { total: 5 } })

    render(DashboardTile)

    // Check that title and icon appear
    expect(await screen.findByText(/total customers/i)).toBeInTheDocument()
    expect(screen.getByText('👥')).toBeInTheDocument()
  })

  it('fetches and displays total customers from API', async () => {
    (api.get as any).mockResolvedValue({ data: { total: 42 } })

    render(DashboardTile)

    // Wait for API call and UI update
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/Customers/total')
      expect(screen.getByText('42')).toBeInTheDocument()
    })
  })

  it('displays 0 when API returns no data', async () => {
    (api.get as any).mockResolvedValue({ data: {} })

    render(DashboardTile)

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    ;(api.get as any).mockRejectedValue(new Error('Network error'))

    render(DashboardTile)

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to fetch total customers',
        expect.any(Error)
      )
    })

    consoleErrorSpy.mockRestore()
  })

  it('navigates to /customers when clicked', async () => {
    (api.get as any).mockResolvedValue({ data: { total: 10 } })

    render(DashboardTile)

    const tile = await screen.findByText(/total customers/i)
    await fireEvent.click(tile)

    expect(pushMock).toHaveBeenCalledWith({path :'/customers'})
  })
})
