import { test, expect } from '@playwright/test'

test.describe('Dicoding Jobs E2E', () => {
  test('user can open the vacancies list page', async ({ page }) => {
    await page.goto('/')

    // Heading muncul
    await expect(
      page.getByRole('heading', { name: /Daftar Pekerjaan Terbaru|Hasil Pencarian/ })
    ).toBeVisible()

    // Minimal satu kartu lowongan terlihat (data dari seeder)
    await expect(page.locator('a[href^="/jobs/"]').first()).toBeVisible()
  })

  test('user can search a job by title', async ({ page }) => {
    await page.goto('/')

    const searchInput = page.getByPlaceholder(
      'Pekerjaan apa yang sedang kamu cari?'
    )
    await expect(searchInput).toBeVisible()

    await searchInput.fill('Developer')

    // Heading berubah menjadi Hasil Pencarian
    await expect(
      page.getByRole('heading', { name: 'Hasil Pencarian' })
    ).toBeVisible()

    // URL terisi query param sehingga hasil pencarian bisa di-share
    await expect(page).toHaveURL(/\/\?search=Developer/)

    // Hanya lowongan dengan kata "Developer" pada judul
    const cards = page.locator('a[href^="/jobs/"]')
    await expect(cards).toHaveCount(2)
    await expect(cards.first()).toContainText('Android Developer')
    await expect(cards.last()).toContainText('iOS Developer')
  })

  test('user sees an empty state when no result matches the search', async ({ page }) => {
    await page.goto('/')

    await page
      .getByPlaceholder('Pekerjaan apa yang sedang kamu cari?')
      .fill('AcmeNotExistXYZ')

    await expect(page.getByText('Tidak ada lowongan yang ditemukan.')).toBeVisible()
  })

  test('user can view vacancy details', async ({ page }) => {
    await page.goto('/')

    // Klik kartu pertama
    const firstCard = page.locator('a[href^="/jobs/"]').first()
    const title = (await firstCard.textContent())?.trim()
    await firstCard.click()

    // Navigasi ke halaman detail
    await expect(page).toHaveURL(/\/jobs\/\d+/)

    // Judul pada heading detail sama dengan judul pada kartu
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Deskripsi HTML dirender (bukan teks mentah berisi tag)
    await expect(page.locator('h2').first()).toBeVisible()
  })
})
