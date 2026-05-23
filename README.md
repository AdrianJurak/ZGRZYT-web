```markdown
# ZGRZYT - Web Client (Frontend)

Frontendowa aplikacja typu Single Page Application (SPA) stworzona dla systemu obsługi zgłoszeń (Helpdesk) ZGRZYT. 

Aplikacja zapewnia nowoczesny, reaktywny interfejs użytkownika, komunikujący się z backendem (Laravel 12) za pomocą bezpiecznego REST API. Zastosowano w niej rygorystyczne mechanizmy bezpieczeństwa, w tym autoryzację opartą na ciasteczkach sesyjnych `HttpOnly` (ochrona przed XSS), weryfikację tokenów CSRF oraz komunikację w czasie rzeczywistym z wykorzystaniem technologii WebSockets.

## 🚀 Główne funkcjonalności
* **Uwierzytelnianie:** Bezpieczne logowanie i zarządzanie sesją SPA z wykorzystaniem Laravel Sanctum.
* **Autoryzacja RBAC:** Interfejs dynamicznie dostosowujący się do roli zalogowanego użytkownika (User, IT, Admin).
* **Zarządzanie zgłoszeniami:** Tworzenie, przeglądanie i zmiana statusów ticketów.
* **Real-time Chat:** Asynchroniczna komunikacja wewnątrz zgłoszeń w czasie rzeczywistym (obsługiwana przez Laravel Echo i serwer Reverb).

## 🛠 Tech Stack
* **Framework:** Vue.js 3 (Composition API)
* **Build Tool:** Vite
* **State Management:** Pinia
* **Klient HTTP:** Axios (skonfigurowany pod CORS i obsługę credentials)
* **WebSockets:** Laravel Echo & Pusher-js

---

## ⚙️ Uruchomienie lokalne (Development)

### 1. Wymagania wstępne
Aby uruchomić projekt lokalnie, upewnij się, że masz zainstalowane:
* [Node.js](https://nodejs.org/) (zalecana wersja 18.x lub nowsza)
* Menedżer pakietów `npm` (lub `yarn` / `pnpm`)

### 2. Instalacja
Sklonuj repozytorium i zainstaluj niezbędne zależności:

```bash
git clone <adres-repozytorium>
cd ZGRZYT-web
npm install
```

### 3. Zmienne środowiskowe
Skopiuj przykładowy plik konfiguracyjny (jeśli istnieje) lub utwórz nowy plik `.env` w głównym katalogu projektu:

```bash
cp .env.example .env
```

Uzupełnij plik `.env` danymi dostępowymi do backendu oraz serwera WebSockets. Przykład:

```env
# Adres serwera głównego API (Backend)
VITE_API_BASE_URL="https://twój-backend.onrender.com"

# Konfiguracja serwera WebSockets (Reverb/Pusher)
VITE_REVERB_HOST="twój-serwer-websockets.onrender.com"
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME="https"
VITE_REVERB_APP_KEY="twój-publiczny-klucz-reverb"
```

### 4. Uruchomienie serwera deweloperskiego
Uruchom aplikację za pomocą polecenia:

```bash
npm run dev
```
Aplikacja będzie domyślnie dostępna w przeglądarce pod adresem `http://localhost:5173`.

---

## 📦 Budowanie na produkcję (Deployment)

Aby zbudować zoptymalizowaną wersję aplikacji gotową do wdrożenia na środowisko produkcyjne (np. Vercel, Netlify), uruchom:

```bash
npm run build
```
Wygenerowane pliki statyczne znajdą się w katalogu `/dist`.

**Uwaga dotycząca Vercel:** Projekt wymaga włączenia reguł przepisywania ścieżek (rewrites) oraz odpowiednich nagłówków CORS. Zostało to skonfigurowane w dołączonym pliku `vercel.json`
