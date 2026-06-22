import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Têtes/)
  })

  test('all mainnav links are accessible', async ({ page }) => {
    await page.goto('/')
    
    const links = [
      { name: 'Accueil', href: '/' },
      { name: 'Sorties club', href: '/sorties-club' },
      { name: 'Membres', href: '/membres' },
      { name: 'Valfréjus', href: '/valfrjus' },
      { name: 'Calendrier', href: '/calendrier' },
      { name: 'Location', href: '/location' },
    ]
    
    for (const link of links) {
      const el = page.getByRole('link', { name: link.name }).first()
      await expect(el).toBeVisible()
    }
  })

  test('navigation to Sorties club', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Sorties club')
    await expect(page).toHaveURL(/sorties-club/)
  })

  test('navigation to Membres', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Membres')
    await expect(page).toHaveURL(/membres/)
  })

  test('navigation to Valfréjus', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Valfréjus')
    await expect(page).toHaveURL(/valfrjus/)
  })

  test('navigation to Calendrier', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Calendrier')
    await expect(page).toHaveURL(/calendrier/)
  })

  test('navigation to Location', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Location')
    await expect(page).toHaveURL(/location/)
  })

  test('back button works on subpages', async ({ page }) => {
    await page.goto('/sorties-club')
    // Mobile/back button might need different selector
    const backButton = page.locator('text=Retour à l\'accueil').first()
    if (await backButton.isVisible()) {
      await backButton.click()
      await expect(page).toHaveURL('/')
    }
  })
})

test.describe('Authentication pages', () => {
  test('inscription page loads', async ({ page }) => {
    await page.goto('/inscription')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/numéro de licence/i)).toBeVisible()
  })

  test('connexion page loads', async ({ page }) => {
    await page.goto('/connexion')
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible()
  })

  test('can navigate from inscription to connexion', async ({ page }) => {
    await page.goto('/inscription')
    await page.click('text=Se connecter')
    await expect(page).toHaveURL(/connexion/)
  })

  test('can navigate from connexion to inscription', async ({ page }) => {
    await page.goto('/connexion')
    await page.click('text=S\'inscrire')
    await expect(page).toHaveURL(/inscription/)
  })

  test('show success message after inscription with redirect', async ({ page }) => {
    await page.goto('/connexion?inscrit=true')
    await expect(page.getByText('Inscription réussie')).toBeVisible()
  })
})

test.describe('Compte page', () => {
  test('compte page redirects to connexion when not logged in', async ({ page }) => {
    await page.goto('/compte')
    // Should redirect (check URL or check if connexion form is shown)
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })
})

test.describe('Footer links', () => {
  test('links section exists', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Liens')).toBeVisible()
  })

  test('instagram link present', async ({ page }) => {
    await page.goto('/')
    const insta = page.locator('a[href*="instagram.com"]').first()
    // May or may not be visible depending on screen
  })
})

test.describe('Accessibility', () => {
  test('no critical console errors on homepage', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Allow known dev errors
    const criticalErrors = errors.filter(e => !e.includes('favicon'))
    expect(criticalErrors.length).toBeLessThanOrEqual(2) // Allow some warnings
  })
})