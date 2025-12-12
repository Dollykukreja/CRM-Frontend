import { render, screen, fireEvent, waitFor } from '@testing-library/vue'
import CustomerList from '@/components/Views/CustomerList.vue'
import * as customerService from '@/Services/customer'
import { vi } from 'vitest'

vi.mock('@/Services/customer', () => ({
  getCustomers: vi.fn(),
  createCustomer: vi.fn(),
  updateCustomer: vi.fn(),
  deleteCustomer: vi.fn(),
}))

const mockedService = customerService as any

// Mock confirm dialog for delete
vi.stubGlobal('confirm', () => true)

describe('CustomerList.vue', () => {
  const sampleCustomers = [
    {
      id: 1,
      name: 'John Doe',
      company: 'Acme Corp',
      address: '123 Street',
      emails: ['john@example.com'],
      phone: ['1234567890'],
      contacts: [
        { type: 'Email', value: 'john@example.com' },
        { type: 'Phone', value: '1234567890' },
      ],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('role', 'Admin') // test as Admin
    mockedService.getCustomers.mockResolvedValue(sampleCustomers)
  })

  it('renders search input, table headers, and add button for Admin', async () => {
    render(CustomerList)
    expect(await screen.findByPlaceholderText(/search customers/i)).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: /\+ add customer/i })).toBeInTheDocument()
    expect(screen.getByText(/name/i)).toBeInTheDocument()
    expect(screen.getByText(/email/i)).toBeInTheDocument()
    expect(screen.getByText(/phone/i)).toBeInTheDocument()
  })

  it('displays customer data from API', async () => {
    render(CustomerList)
    expect(await screen.findByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('123 Street')).toBeInTheDocument()
  })

  it('opens and closes create/edit modal', async () => {
    render(CustomerList)
    const addBtn = await screen.findByRole('button', { name: /\+ add customer/i })
await fireEvent.click(addBtn)

// Wait for the modal heading to appear
const modalHeading = await screen.findByRole('heading', { name: /add customer/i })
expect(modalHeading).toBeInTheDocument()

const cancelBtn = await screen.findByRole('button', { name: /cancel/i })
await fireEvent.click(cancelBtn)

await waitFor(() => {
  expect(screen.queryByRole('heading', { name: /add customer/i })).not.toBeInTheDocument()
})

  })

  it('opens view contacts modal', async () => {
    render(CustomerList)
    const viewBtn = await screen.findByRole('button', { name: /view/i })
    await fireEvent.click(viewBtn)

    expect(await screen.findByText(/contact details/i)).toBeInTheDocument()
  })

  it('calls deleteCustomer when Delete button is clicked', async () => {
    render(CustomerList)
    const deleteBtn = await screen.findByRole('button', { name: /delete/i })
    await fireEvent.click(deleteBtn)

    await waitFor(() => {
      expect(mockedService.deleteCustomer).toHaveBeenCalledWith(1)
    })
  })

  it('filters customers on search input', async () => {
    render(CustomerList)
    const input = await screen.findByPlaceholderText(/search customers/i)
    await fireEvent.update(input, 'John')

    await waitFor(() => {
      expect(mockedService.getCustomers).toHaveBeenCalledWith('John', 1, 50)
    })
  })
})
