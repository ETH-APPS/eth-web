# Deployment VM

Dokumen ini adalah handoff deployment manual monorepo `eth-web` ke VM milik sendiri.
Fokus deployment saat ini hanya frontend Nuxt. Backend NestJS belum dijalankan.

## Status terakhir

Deployment berikut sudah berhasil dan dapat diakses publik pada 23 Oktober 2026:

- VM: Ubuntu 24.04.2 LTS, amd64
- Hostname: `eth-apps`
- User deployment: `ethapps`
- Private IP: `192.168.10.95`
- Direktori aplikasi: `/opt/eth-web`
- Repository: `git@github.com:ETH-APPS/eth-web.git` (private)
- Branch: `main`
- Commit yang sedang di-deploy: `dfd11d9`
- Image frontend: `eth-web-web:dfd11d9`
- Docker Engine, Compose plugin, dan Buildx sudah tersedia
- Container dijalankan dengan `sudo docker ...`; user `ethapps` sengaja tidak
  dimasukkan ke grup `docker`

Quick Tunnel yang dibuat saat deployment:

```text
https://dream-terrace-resolve-art.trycloudflare.com
```

URL tersebut bersifat sementara dan dapat berubah saat container `cloudflared`
dibuat ulang atau tunnel melakukan registrasi ulang. Jangan menganggapnya sebagai
alamat production permanen.

## Yang sudah terbukti

- Deploy key GitHub khusus VM berhasil digunakan dan disetel read-only di repo.
- Repo berhasil di-clone ke `/opt/eth-web`.
- Commit di VM terverifikasi sebagai `dfd11d9`.
- `docker compose config --quiet` berhasil.
- Image Nuxt berhasil dibangun di VM amd64.
- Container `web` dan `gateway` berstatus healthy.
- Container `cloudflared` berhasil tersambung memakai QUIC.
- `curl -I http://127.0.0.1:8080/` menghasilkan `HTTP/1.1 200 OK` melalui Caddy.
- URL Quick Tunnel menghasilkan `HTTP/2 200` melalui Cloudflare, Caddy, dan Nuxt.
- Host hanya listen pada `127.0.0.1:8080` untuk aplikasi ini.
- Port `3000` dan `3001` tidak dipublikasikan ke host.

Output `docker compose ps` yang diharapkan:

- `web`: healthy, hanya `3000/tcp` internal Docker.
- `gateway`: healthy, hanya `127.0.0.1:8080->80/tcp` yang dipublikasikan.
- `cloudflared`: berjalan tanpa host port.

## Arsitektur saat ini

```text
Internet
  -> Cloudflare Quick Tunnel (HTTPS, URL sementara)
  -> cloudflared: http://gateway:80
  -> Caddy gateway: reverse_proxy web:3000
  -> Nuxt/Nitro: 0.0.0.0:3000 di jaringan Docker
```

`web` tidak memiliki `ports` di Compose. Caddy hanya di-bind ke loopback VM,
sehingga UFW bukan satu-satunya perlindungan terhadap port aplikasi yang
dipublikasikan Docker.

## File deployment

- `apps/web/Dockerfile`: multi-stage build Nuxt; runtime memakai user non-root
  `node` dan menjalankan `.output/server/index.mjs`.
- `compose.yaml`: service `web`, `gateway`, dan `cloudflared`.
- `deploy/Caddyfile`: HTTP gateway pada port 80 dan reverse proxy ke `web:3000`.
- `.dockerignore`: mengecualikan dependency, build output, cache, log, dan `.env*`.

Frontend belum memakai `runtimeConfig` atau secret runtime. Tidak ada `.env` yang
dibutuhkan untuk deployment commit ini.

## Deploy pertama yang telah dijalankan

Deploy key berada di VM pada:

```text
/home/ethapps/.ssh/eth-web-deploy
```

Private key tersebut tidak boleh ditampilkan, disalin ke repo, atau dibagikan.
Public key sudah terdaftar sebagai read-only deploy key pada GitHub.

Repo di-clone dengan key khusus:

```bash
GIT_SSH_COMMAND='ssh -i /home/ethapps/.ssh/eth-web-deploy -o IdentitiesOnly=yes' git clone --branch main --single-branch git@github.com:ETH-APPS/eth-web.git /opt/eth-web
```

Konfigurasi divalidasi dan image dibangun dengan commit SHA sebagai tag:

```bash
sudo env IMAGE_TAG=dfd11d9 docker compose -f /opt/eth-web/compose.yaml config --quiet
sudo env IMAGE_TAG=dfd11d9 docker compose -f /opt/eth-web/compose.yaml build web
```

Frontend dan gateway dinyalakan lebih dahulu, kemudian tunnel:

```bash
sudo env IMAGE_TAG=dfd11d9 docker compose -f /opt/eth-web/compose.yaml up -d web gateway
sudo env IMAGE_TAG=dfd11d9 docker compose -f /opt/eth-web/compose.yaml up -d cloudflared
```

## Pemeriksaan operasional

Selalu gunakan nilai `IMAGE_TAG` yang sama pada `build`, `up`, `ps`, dan command
Compose lain agar Compose mengacu ke release yang benar.

Status container:

```bash
sudo env IMAGE_TAG=dfd11d9 docker compose -f /opt/eth-web/compose.yaml ps
```

Uji gateway lokal:

```bash
curl -I http://127.0.0.1:8080/
```

Periksa port host:

```bash
sudo ss -lntp '( sport = :3000 or sport = :3001 or sport = :8080 )'
```

Hanya `127.0.0.1:8080` yang seharusnya muncul.

Lihat log tunnel dan URL Quick Tunnel terbaru:

```bash
sudo env IMAGE_TAG=dfd11d9 docker compose -f /opt/eth-web/compose.yaml logs --no-color --tail=200 cloudflared
```

Peringatan `failed to sufficiently increase receive buffer size` pernah muncul,
tetapi tidak fatal pada deployment ini: koneksi QUIC berhasil diregistrasikan dan
seluruh connectivity pre-check berstatus `PASS`.

## Prosedur update manual berikutnya

Jalankan hanya setelah perubahan yang ingin di-deploy sudah di-commit dan di-push
ke `main`. Jangan mengandalkan perubahan lokal yang belum masuk GitHub.

1. Ambil commit terbaru menggunakan deploy key khusus VM.

   ```bash
   GIT_SSH_COMMAND='ssh -i /home/ethapps/.ssh/eth-web-deploy -o IdentitiesOnly=yes' git -C /opt/eth-web pull --ff-only origin main
   ```

2. Catat short SHA yang akan dipakai sebagai tag.

   ```bash
   git -C /opt/eth-web rev-parse --short HEAD
   ```

3. Ganti `<SHA>` pada command berikut dengan output langkah sebelumnya, lalu
   validasi, build, dan jalankan release tersebut.

   ```bash
   sudo env IMAGE_TAG=<SHA> docker compose -f /opt/eth-web/compose.yaml config --quiet
   sudo env IMAGE_TAG=<SHA> docker compose -f /opt/eth-web/compose.yaml build web
   sudo env IMAGE_TAG=<SHA> docker compose -f /opt/eth-web/compose.yaml up -d
   ```

4. Ulangi pemeriksaan status, log, gateway lokal, port host, dan URL publik.

Jangan menjalankan `git reset --hard` atau menghapus image lama tanpa memastikan
rollback tidak lagi diperlukan.

## Pekerjaan yang belum selesai

- Uji reboot VM dan pastikan ketiga container kembali berjalan karena memakai
  `restart: unless-stopped`.
- Pin versi atau digest image yang saat ini masih floating:
  `node:24-slim`, `caddy:2`, dan terutama `cloudflare/cloudflared:latest`.
- Tulis dan uji prosedur rollback ke commit/image sebelumnya.
- Pindah dari Quick Tunnel ke named tunnel dan domain sendiri untuk alamat stabil.
- Tambahkan observability/monitoring dan kebijakan backup bila aplikasi sudah
  memiliki data persisten.
- Deploy backend NestJS setelah Dockerfile, health endpoint, routing `/api`, dan
  kebutuhan database/migrasi sudah ditentukan.

## Backend yang sengaja ditunda

`apps/api` belum menjadi bagian deployment ini. Kondisinya saat ini:

- belum ada Dockerfile/service Compose untuk API;
- belum ada health endpoint;
- belum ada prefix `/api`;
- belum ada routing Caddy ke API;
- belum ada konfigurasi database, migrasi, volume, atau backup;
- port default NestJS adalah `3001`, tetapi port tersebut tidak sedang listen di VM.

Ketika API ditambahkan, pertahankan prinsip yang sama: jangan publish port 3001
ke host. Route request melalui Caddy pada jaringan Docker.

## Catatan untuk agent berikutnya

- Bedakan fakta dari output VM dengan asumsi atau rencana.
- Berikan satu command atau satu langkah per giliran kepada pengguna, jelaskan
  tujuan dan risikonya, lalu tunggu output.
- Jangan meminta atau menampilkan password, PAT, private key, token tunnel, atau
  secret lain.
- Jangan melakukan full system upgrade di VM.
- Jangan mengubah file tanpa persetujuan eksplisit pengguna.
- Nuxt menggunakan Vite.
- Fokus saat ini tetap frontend dan stabilisasi deployment manual.
- Commit yang di-deploy hanya `dfd11d9`. Perubahan working tree lokal setelah
  commit tersebut belum ikut ke VM sampai di-commit, di-push, dan di-deploy ulang.
