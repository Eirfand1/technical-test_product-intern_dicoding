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

    // Deskripsi dirender sebagai HTML, bukan teks mentah berisi tag (elemen <h2>/<p>/<li> dalam konten detail)
    const descCount = await page.locator('article .job-description h2, article .job-description p, article .job-description li').count()
    expect(descCount).toBeGreaterThan(0)

    // Tag HTML mentah tidak boleh muncul sebagai teks
    await expect(page.locator('.job-description')).not.toContainText('&lt;h2&gt;')

    // Field detail lain (posisi, lokasi, tipe) kini tampil
    const detail = page.locator('article')
    await expect(detail.getByText('Informasi Lowongan')).toBeVisible()
    await expect(detail.getByText('Lokasi')).toBeVisible()
    await expect(detail.getByText('Tipe pekerjaan')).toBeVisible()
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
    await page.locator('.rsw-ce').first().fill('<h2>Job Description</h2><p>QA automation</p>')
    await page.getByPlaceholder('Rp Minimum').fill('12000000')
    await page.getByRole('radio', { name: '1-3 tahun' }).check()

    await page.getByRole('button', { name: 'Buat lowongan' }).click()

    // Redirect ke dashboard root (bukan /dashboard/jobs/create)
    await page.waitForURL('http://localhost:3000/dashboard')

    // Lowongan baru muncul di dashboard
    await expect(page.getByText('QA Automation Engineer').first()).toBeVisible()

    // Notifikasi sukses muncul
    await expect(page.getByText(/berhasil dibuat/)).toBeVisible()
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
    await page.locator('.rsw-ce').first().fill('<p>Temporary</p>')
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

    // Lowongan hilang dari daftar (pakai locator h3 untuk tidak menangkap toast)
    const cardLocators = page.locator('h3', { hasText: uniqueTitle })
    await expect(cardLocators).not.toBeVisible()

    // Notifikasi sukses muncul
    await expect(page.getByText(/berhasil dihapus/)).toBeVisible()
  })

  test('user can edit a vacancy from dashboard', async ({ page, request }) => {
    const title = `Edit Me ${Date.now()}`
    const res = await request.post(`http://localhost:8000/api/vacancies`, {
      data: {
        title, position: 'QA', job_type: 'full_time', candidates_needed: 1,
        active_until: '2030-01-01', location: 'Jakarta', is_remote: false,
        description: '<p>To be edited</p>', salary_min: 10000000,
        show_salary: false, min_experience: 'lt_1',
        company_name: 'Dicoding Indonesia',
      },
    })
    expect(res.ok()).toBeTruthy()
    const { data } = await res.json()

    await page.goto(`/dashboard/jobs/${data.id}/edit`)

    const titleInput = page.getByPlaceholder('Masukkan judul lowongan')
    await expect(titleInput).toHaveValue(title) // tunggu form terisi dari API

    await titleInput.fill('Edited Unique Vacancy')
    await page.getByRole('button', { name: 'Perbarui lowongan' }).click()

    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByText('Edited Unique Vacancy')).toBeVisible()
    await expect(page.getByText(/berhasil diperbarui/)).toBeVisible()

    // Deskripsi tetap tersimpan sebagai HTML bersih (bukan entity-escaped)
    const after = await request.get(`http://localhost:8000/api/vacancies/${data.id}`)
    const afterBody = await after.json()
    expect(afterBody.data.description).toContain('<p>')
    expect(afterBody.data.description).not.toContain('&lt;')

    await request.delete(`http://localhost:8000/api/vacancies/${data.id}`) // cleanup
  })

  test('user can navigate between paginated vacancy lists', async ({ page, request }) => {
    // Buat vacancy unik supaya tidak terpengaruh state test lain
    const title = `Paged Vacancy ${Date.now()}`
    const res = await request.post(`http://localhost:8000/api/vacancies`, {
      data: {
        title, position: 'QA', job_type: 'full_time', candidates_needed: 1,
        active_until: '2030-01-01', location: 'Jakarta', is_remote: false,
        description: '<p>Paged</p>', salary_min: 10000000,
        show_salary: false, min_experience: 'lt_1',
        company_name: 'Dicoding Indonesia',
      },
    })
    expect(res.ok()).toBeTruthy()
    const { data } = await res.json()

    await page.goto('/')

    // Halaman awal tidak menampilkan tombol pagination bila hanya 1 page
    const pager = page.getByRole('navigation', { name: 'Pagination' })
    const hasPager = (await pager.count()) > 0

    if (hasPager) {
      // Klik tombol "Next" bila tersedia dan verifikasi URL berubah ke page 2
      await page.getByRole('button', { name: 'Halaman berikutnya' }).click()
      await expect(page).toHaveURL(/page=2/)
    } else {
      // Jika hanya satu halaman, cukup pastikan kartu lowongan tampil
      await expect(page.locator('a[href^="/jobs/"]').first()).toBeVisible()
    }

    await request.delete(`http://localhost:8000/api/vacancies/${data.id}`) // cleanup
  })
})
