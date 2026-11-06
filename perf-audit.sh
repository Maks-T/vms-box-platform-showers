#!/usr/bin/env bash
# =============================================================================
# Аудит производительности VMS-NC на сервере (только чтение, ничего не меняет).
#
# Запуск (под root, как vms-manager):
#   bash perf-audit.sh /var/www/dev-projects/showers-cpq.tech showers-cpq.tech php8.5-fpm
#
# Аргументы: <каталог проекта (без /current)> <домен> <служба php-fpm>
# =============================================================================
set -u

PROJECT_DIR="${1:-/var/www/dev-projects/showers-cpq.tech}"
DOMAIN="${2:-showers-cpq.tech}"
FPM="${3:-php8.5-fpm}"
CURRENT="$PROJECT_DIR/current"
ENV_FILE="$PROJECT_DIR/shared/.env"
FPM_BIN="${FPM/-fpm/}"          # php8.5-fpm -> php8.5
FPM_BIN="php-fpm${FPM_BIN#php}" # -> php-fpm8.5
PHP_VER="${FPM#php}"; PHP_VER="${PHP_VER%-fpm}"

G='\033[0;32m'; R='\033[0;31m'; Y='\033[1;33m'; C='\033[0;36m'; NC='\033[0m'
ok()   { echo -e "  ${G}✔${NC} $*"; }
bad()  { echo -e "  ${R}✘${NC} $*"; }
warn() { echo -e "  ${Y}!${NC} $*"; }
hdr()  { echo -e "\n${C}== $* ==${NC}"; }

[ -d "$CURRENT" ] || { echo "Нет каталога $CURRENT"; exit 1; }
cd "$CURRENT" || exit 1

# -----------------------------------------------------------------------------
hdr "1. PHP-FPM ($FPM_BIN): OPcache и Xdebug"
if command -v "$FPM_BIN" >/dev/null 2>&1; then
  FPM_INFO="$("$FPM_BIN" -i 2>/dev/null)"
  get() { echo "$FPM_INFO" | grep -E "^$1 =>" | head -1 | awk -F'=>' '{gsub(/ /,"",$2); print $2}'; }

  [ "$(get opcache.enable)" = "On" ] && ok "opcache.enable = On" || bad "opcache.enable = $(get opcache.enable) — каждый запрос перекомпилирует PHP"
  echo "     memory_consumption=$(get opcache.memory_consumption)  max_accelerated_files=$(get opcache.max_accelerated_files)  interned_strings=$(get opcache.interned_strings_buffer)"
  echo "     validate_timestamps=$(get opcache.validate_timestamps)  revalidate_freq=$(get opcache.revalidate_freq)  jit=$(get opcache.jit)"
  MEM=$(get opcache.memory_consumption); FILES=$(get opcache.max_accelerated_files)
  [ -n "$MEM" ] && [ "$MEM" -lt 256 ] 2>/dev/null && warn "memory_consumption < 256 МБ: на сервере ~12 проектов Filament, кэш будет вытесняться"
  [ -n "$FILES" ] && [ "$FILES" -lt 20000 ] 2>/dev/null && warn "max_accelerated_files < 20000: Laravel+Filament одного проекта ≈ 8–12 тыс. файлов"

  if "$FPM_BIN" -m 2>/dev/null | grep -qi xdebug; then
    bad "Xdebug ЗАГРУЖЕН в FPM (mode=$(get xdebug.mode)) — на продакшене его быть не должно"
  else
    ok "Xdebug в FPM не загружен"
  fi
else
  warn "$FPM_BIN не найден — пропуск"
fi

hdr "2. Пул PHP-FPM"
POOL_DIR="/etc/php/$PHP_VER/fpm/pool.d"
if [ -d "$POOL_DIR" ]; then
  grep -hE "^\s*(\[|pm\s*=|pm\.max_children|pm\.start_servers|pm\.max_spare|pm\.max_requests|request_terminate_timeout)" "$POOL_DIR"/*.conf | sed 's/^/     /'
else
  warn "$POOL_DIR не найден"
fi

# -----------------------------------------------------------------------------
hdr "3. .env проекта (только ключи, влияющие на скорость)"
if [ -f "$ENV_FILE" ]; then
  for k in APP_ENV APP_DEBUG CACHE_STORE SESSION_DRIVER QUEUE_CONNECTION LOG_LEVEL VMS_LOCALES; do
    v=$(grep -E "^$k=" "$ENV_FILE" | head -1 | cut -d= -f2-)
    echo "     $k=$v"
  done
  grep -qE '^APP_DEBUG="?true' "$ENV_FILE" && bad "APP_DEBUG=true на продакшене: медленнее и показывает трейсы/SQL при ошибках"
  # Ключи, которые ядро читает через env() в обход config — сломаются после config:cache
  for k in VMS_ORDER_PREFIX ADMIN_EMAILS CLIENT_SITE_URL; do
    grep -qE "^$k=" "$ENV_FILE" && warn "$k задан в .env, но ядро читает его через env(): после config:cache значение пропадёт"
  done
else
  warn "Нет $ENV_FILE"
fi

# -----------------------------------------------------------------------------
hdr "4. Кэши Laravel / Filament в текущем релизе"
chk() { [ -e "$1" ] && ok "$2" || bad "$2 — НЕТ ($1)"; }
chk bootstrap/cache/config.php                 "config:cache"
ls bootstrap/cache/routes-v*.php >/dev/null 2>&1 && ok "route:cache" || bad "route:cache — НЕТ"
chk bootstrap/cache/events.php                 "event:cache"
chk bootstrap/cache/filament/panels/admin.php  "filament:cache-components (сканирование ресурсов)"
chk bootstrap/cache/blade-icons.php            "icons:cache (blade-icons)"
VIEWS=$(find storage/framework/views -name '*.php' 2>/dev/null | wc -l)
echo "     скомпилированных Blade-шаблонов: $VIEWS"
echo "     релиз: $(readlink -f "$CURRENT")"

# -----------------------------------------------------------------------------
hdr "5. Время ответа через nginx + FPM (5 замеров, медиана)"
measure() {
  local url="$1" label="$2" arr=() code=""
  for _ in 1 2 3 4 5; do
    out=$(curl -s -o /dev/null -w "%{http_code} %{time_starttransfer}" "$url")
    code=${out%% *}; arr+=("${out##* }")
  done
  med=$(printf '%s\n' "${arr[@]}" | sort -n | sed -n 3p)
  printf "     %-28s HTTP %s  TTFB медиана: %s c   (все: %s)\n" "$label" "$code" "$med" "${arr[*]}"
}
measure "https://$DOMAIN/up"          "/up (голый Laravel)"
measure "https://$DOMAIN/admin/login" "/admin/login (Filament)"
echo "     Ориентир: /up < 0.05 c, /admin/login < 0.15 c при прогретом OPcache и кэшах."

# -----------------------------------------------------------------------------
hdr "6. Фоновые процессы"
if pgrep -af "queue:work|horizon" | grep -q "$PROJECT_DIR"; then
  ok "воркер очереди для проекта запущен"
else
  warn "воркер очереди для $PROJECT_DIR не найден (QUEUE_CONNECTION=redis — задачи будут копиться)"
fi
command -v redis-cli >/dev/null 2>&1 && { redis-cli ping >/dev/null 2>&1 && ok "Redis отвечает" || bad "Redis не отвечает"; }

echo -e "\n${C}Готово. Дальше: sudo -u www-data php perf-audit.php $CURRENT --http --livewire${NC}"
