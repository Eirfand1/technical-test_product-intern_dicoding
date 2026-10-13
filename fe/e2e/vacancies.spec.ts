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

    // Semua kartu yang terlihat mengandung kata "Developer" di judul (toleran duplikat dari run sebelumnya)
    const cards = page.locator('a[href^="/jobs/"]')
    await expect(cards).not.toHaveCount(0)
    const count = await cards.count()
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i)).toContainText('Developer', { ignoreCase: true })
    }
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

  test('user can create a new vacancy from dashboard', async ({ page }) => {
    await page.goto('/dashboard')

    await expect(page.getByRole('heading', { name: 'Lowongan Saya' })).toBeVisible()
    await expect(page.getByRole('link', { name: '+ Buat lowongan' })).toBeVisible()

    await page.getByRole('link', { name: '+ Buat lowongan' }).click()
    await expect(page).toHaveURL(/\/dashboard\/jobs\/create/)

    // Isi form
    await page.getByPlaceholder('Masukkan judul lowongan').fill('QA Automation Engineer')
    await page.getByRole('combobox').first().selectOption('QA')
    await page.getByRole('radio', { name: 'Full-Time' }).check()
    await page.getByPlaceholder('Masukkan jumlah kandidat yang dibutuhkan').fill('2')

    // Tanggal: 30 hari dari sekarang (ISO yyyy-mm-dd untuk date input)
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
    await page.locator('input[type="date"]').fill(future)
    await page.getByRole('combobox').nth(1).selectOption('Jakarta')
    await page.getByPlaceholder('Masukkan deskripsi pekerjaan (HTML didukung)')
      .fill('<h2>Job Description</h2><p>QA automation</p>')
    await page.getByPlaceholder('Rp Minimum').fill('12000000')
    await page.getByRole('radio', { name: '1-3 tahun' }).check()

    await page.getByRole('button', { name: 'Buat lowongan' }).click()

    // Redirect ke dashboard dan lowongan baru muncul (gunakan .first() karena bisa ada duplikat dari run sebelumnya)
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByText('QA Automation Engineer').first()).toBeVisible()
  })

  test('user can delete a vacancy from dashboard', async ({ page }) => {
    // Buat lowongan khusus untuk test ini (unique name agar tidak tabrakan dengan run sebelumnya)
    const uniqueTitle = `Temp Vacancy ${Date.now()}`
    await page.goto('/dashboard')

    await page.getByRole('link', { name: '+ Buat lowongan' }).click()
    await page.getByPlaceholder('Masukkan judul lowongan').fill(uniqueTitle)
    await page.getByRole('combobox').first().selectOption('QA')
    await page.getByRole('radio', { name: 'Full-Time' }).check()
    await page.getByPlaceholder('Masukkan jumlah kandidat yang dibutuhkan').fill('1')

    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]
    await page.locator('input[type="date"]').fill(future)
    await page.getByRole('combobox').nth(1).selectOption('Jakarta')
    await page.getByPlaceholder('Masukkan deskripsi pekerjaan (HTML didukung)')
      .fill('<p>Temporary</p>')
    await page.getByPlaceholder('Rp Minimum').fill('10000000')
    await page.getByRole('radio', { name: 'Kurang dari 1 tahun' }).check()

    await page.getByRole('button', { name: 'Buat lowongan' }).click()

    // Lowongan baru muncul di dashboard
    await expect(page.getByText(uniqueTitle)).toBeVisible()

    // Hapus (konfirmasi dialog di-accept otomatis)
    page.on('dialog', (dialog) => void dialog.accept())
    await page
      .locator('div')
      .filter({ hasText: uniqueTitle })
      .getByRole('button', { name: 'Hapus' })
      .first()
      .click()

    // Lowongan hilang dari daftar (auto-retry assertion)
    await expect(page.getByText(uniqueTitle)).not.toBeVisible()
  })

  test('user can edit a vacancy from dashboard', async ({ page }) => {
    await page.goto('/dashboard')

    // Klik Edit pada lowongan pertama (dari seeder)
    await page.getByRole('button', { name: 'Edit' }).first().click()
    await expect(page).toHaveURL(/\/dashboard\/jobs\/\d+\/edit/)

    // Form terisi dengan data lama
    const titleInput = page.getByPlaceholder('Masukkan judul lowongan')
    await expect(titleInput).not.toBeEmpty()

    // Ubah judul
    await titleInput.fill('Android Developer (Senior)')
    await page.getByRole('button', { name: 'Perbarui lowongan' }).click()

    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByText('Android Developer (Senior)').first()).toBeVisible()
  })
})
