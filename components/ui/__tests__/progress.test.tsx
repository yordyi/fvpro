import React from 'react'
import { render, screen } from '@testing-library/react'
import { Progress } from '../progress'

describe('Progress Component', () => {
  it('renders progress bar', () => {
    const { container } = render(<Progress value={50} />)
    const progressBar = container.querySelector('div[style]')
    expect(progressBar).toBeInTheDocument()
  })

  it('displays correct progress value', () => {
    const { container } = render(<Progress value={75} />)
    const progressBar = container.querySelector('div[style]') as HTMLElement
    expect(progressBar.style.transform).toBe('translateX(-25%)')
  })

  it('handles 0% progress', () => {
    const { container } = render(<Progress value={0} />)
    const progressBar = container.querySelector('div[style]') as HTMLElement
    expect(progressBar.style.transform).toBe('translateX(-100%)')
  })

  it('handles 100% progress', () => {
    const { container } = render(<Progress value={100} />)
    const progressBar = container.querySelector('div[style]') as HTMLElement
    expect(progressBar.style.transform).toBe('translateX(-0%)')
  })

  it('clamps values above 100', () => {
    const { container } = render(<Progress value={150} />)
    const progressBar = container.querySelector('div[style]') as HTMLElement
    expect(progressBar.style.transform).toBe('translateX(-0%)')
  })

  it('clamps negative values to 0', () => {
    const { container } = render(<Progress value={-50} />)
    const progressBar = container.querySelector('div[style]') as HTMLElement
    expect(progressBar.style.transform).toBe('translateX(-100%)')
  })

  it('uses custom max value', () => {
    const { container } = render(<Progress value={50} max={200} />)
    const progressBar = container.querySelector('div[style]') as HTMLElement
    // 50/200 = 25% = translateX(-75%)
    expect(progressBar.style.transform).toBe('translateX(-75%)')
  })

  it('applies custom className', () => {
    const { container } = render(<Progress value={50} className="custom-class" />)
    const progressContainer = container.firstChild as HTMLElement
    expect(progressContainer).toHaveClass('custom-class')
  })
})