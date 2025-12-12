import { render, screen } from '@testing-library/vue'
import Unauthorized from '@/components/Views/Unauthorized.vue'
import { vi } from 'vitest'

// Properly mock router-link as a native <a> for testing
const RouterLinkMock = {
  props: ['to'],
  template: `<a :href="to"><slot /></a>`
}

describe('Unauthorized.vue', () => {

  it('renders 401 message and description', () => {
    render(Unauthorized, {
      global: { components: { RouterLink: RouterLinkMock } }
    })

    expect(screen.getByText('401 - Unauthorized')).toBeInTheDocument()
    expect(screen.getByText("You don’t have permission to access this page.")).toBeInTheDocument()
  })

  it('renders a link to login page', () => {
    render(Unauthorized, {
      global: { components: { RouterLink: RouterLinkMock } }
    })

    const link = screen.getByRole('link', { name: /go to login/i })
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe('/')
  })
})
