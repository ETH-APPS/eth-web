# Logging

Jalankan `pnpm dev` dari root. Output memakai prefix `api:dev:` dan `web:dev:`.
Restart proses lama setelah perubahan konfigurasi.

Backend menghasilkan satu log otomatis setelah request selesai:

```json
{
  "level": "info",
  "time": "2026-11-04T08:37:17.225Z",
  "requestId": "req-001",
  "method": "GET",
  "path": "/",
  "status": 200,
  "durationMs": 4
}
```

4xx memakai `warn` dan `error.message`; field validasi tersedia melalui
`error.fields` bila exception menyediakan mapping tersebut. 5xx memakai `error`
dan menambahkan `error.type` serta lokasi kode aplikasi relatif `error.at` bila
tersedia. Respons HTTP tetap mengikuti Nest. Request terputus memakai
`aborted: true`. Tidak ada log request masuk atau header otomatis.

## Konfigurasi

Salin `apps/api/.env.example` ke `apps/api/.env` bila diperlukan.
Environment shell/container memiliki prioritas lebih tinggi.

- `LOG_LEVEL=info`: default development dan production.
- `LOG_FORMAT=pretty-json`: default development, JSON berindentasi.
- `LOG_FORMAT=json`: default production, satu JSON per baris.
- `LOG_LEVEL=debug` (atau `trace`): error menampilkan stack lengkap menggantikan `at`.
- `LOG_HTTP_BODY=true`: hanya bersama debug/trace, menambahkan `requestBody`
  dan `responseBody` yang disanitasi. Default `false`; header tetap tidak dicetak.

```sh
LOG_LEVEL=debug LOG_HTTP_BODY=true pnpm dev
curl -i http://localhost:3001/
curl -i http://localhost:3001/not-found
```

Prefix Turbo dan output compiler bukan JSON; jalankan proses API secara langsung
untuk konsumsi NDJSON oleh collector. Tidak ada penyimpanan file otomatis.
Log browser tetap berada di DevTools; FE belum tentu memanggil backend.

## Ringkasan form

Endpoint dapat memilih field yang relevan melalui helper:

```ts
import { setHttpLogSummary } from './logging/logger.js';

setHttpLogSummary(req, {
  input: { service: dto.service, weightKg: dto.weightKg },
  result: { id: shipment.id, status: shipment.status },
});
```

Contoh ini ilustrasi; endpoint pengiriman belum ditambahkan. Helper melampirkan
`input` dan `result` ke log akhir, tanpa membuat log kedua. Pilih field aman;
jangan memasukkan nama, alamat atau telepon secara otomatis.

Credential disamarkan secara rekursif. Payload lebih dari 8 KiB diganti metadata
penghilangan; binary dan streaming tidak dibuffer. Path log tidak memuat query;
credential dalam URL yang tercermin di pesan error tetap disamarkan. Redaksi
berdasarkan nama field bukan jaminan untuk secret yang ditulis di pesan bebas.

Logger Nest atau `PinoLogger` dapat dipakai untuk event aplikasi tambahan;
`requestId` otomatis mengikuti konteks request dan dikembalikan melalui header
`x-request-id`. Event aplikasi eksplisit terpisah dari satu log HTTP otomatis.
