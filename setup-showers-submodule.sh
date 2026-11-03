#!/usr/bin/env bash
#
# Выносит пакет valerie/box-industry-showers в отдельный репозиторий
# и подключает его в платформу как git-submodule (как nicole/core).
#
# Запуск из КОРНЯ приложения (где composer.json и artisan):
#   bash setup-showers-submodule.sh            # первый раз: залить пакет + подключить
#   bash setup-showers-submodule.sh --fix-stone  # то же + заменить остатки "stone" в phpunit/makefile/composer
#
# Для ДРУГИХ приложений VMS-NC (пакет уже лежит в репозитории) скрипт сам
# поймёт это и выполнит только подключение submodule.

set -euo pipefail

REPO_URL="${REPO_URL:-git@github.com:Maks-T/vms-box-valerie-showers.git}"
BRANCH="${BRANCH:-valerie/industry-showers/main}"
PKG_PATH="packages/box/valerie/industry-showers"
COMPOSER_NAME="valerie/box-industry-showers"
FIX_STONE=0
[[ "${1:-}" == "--fix-stone" ]] && FIX_STONE=1

say()  { printf '\n\033[1;34m==> %s\033[0m\n' "$*"; }
ok()   { printf '\033[1;32m✔ %s\033[0m\n' "$*"; }
die()  { printf '\033[1;31m✖ %s\033[0m\n' "$*" >&2; exit 1; }

# ---------- 0. Проверки ----------
[[ -f composer.json && -f artisan ]] || die "Запускайте из корня приложения (нет composer.json/artisan)."
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "Корень приложения не git-репозиторий. Сначала git init."
[[ -z "$(git status --porcelain --untracked-files=no)" ]] || die "В рабочем дереве есть незакоммиченные изменения. Закоммитьте или stash."

ROOT="$(pwd)"

# .env не должен попасть в git
if ! grep -qxE '/?\.env' .gitignore 2>/dev/null; then
  say "Добавляю /.env в корневой .gitignore"
  printf '\n/.env\n' >> .gitignore
  git add .gitignore
  git commit -m "chore: ignore .env" >/dev/null
  ok ".env добавлен в .gitignore"
  if git ls-files --error-unmatch .env >/dev/null 2>&1; then
    echo "  ! .env уже отслеживается git. Выполните: git rm --cached .env && git commit"
    echo "  ! и перегенерируйте APP_KEY, если репозиторий уже был опубликован."
  fi
fi

# Уже подключено как submodule?
if git config -f .gitmodules --get "submodule.$PKG_PATH.url" >/dev/null 2>&1; then
  ok "Submodule $PKG_PATH уже подключён. Нечего делать."
  exit 0
fi

# ---------- 1. Публикация пакета (только если папка с кодом есть) ----------
if [[ -d "$PKG_PATH" && -f "$PKG_PATH/composer.json" ]]; then
  say "Шаг 1: публикация пакета в $REPO_URL (ветка $BRANCH)"

  if git ls-remote --exit-code --heads "$REPO_URL" "$BRANCH" >/dev/null 2>&1; then
    ok "Ветка $BRANCH уже есть в удалённом репозитории, публикацию пропускаю."
  else
    (
      cd "$PKG_PATH"
      if [[ ! -e .git ]]; then
        git init -q -b "$BRANCH"
      fi
      git checkout -q -B "$BRANCH"
      grep -qxE '\.env' .gitignore 2>/dev/null || echo ".env" >> .gitignore
      git add -A
      git -c user.name="${GIT_AUTHOR_NAME:-$(git config user.name || echo vms)}" \
          -c user.email="${GIT_AUTHOR_EMAIL:-$(git config user.email || echo vms@localhost)}" \
          commit -q -m "Initial: $COMPOSER_NAME" || true
      git remote remove origin 2>/dev/null || true
      git remote add origin "$REPO_URL"
      git push -u origin "$BRANCH"
    )
    git ls-remote --exit-code --heads "$REPO_URL" "$BRANCH" >/dev/null 2>&1 \
      || die "Пуш не подтверждён на удалённом репозитории. Папку не трогаю."
    ok "Пакет опубликован"
  fi
else
  say "Шаг 1: папки с кодом пакета нет, считаю, что он уже в удалённом репозитории"
  git ls-remote --exit-code --heads "$REPO_URL" "$BRANCH" >/dev/null 2>&1 \
    || die "Ветки $BRANCH нет в $REPO_URL. Сначала опубликуйте пакет."
fi

# ---------- 2. Подмена папки на submodule ----------
say "Шаг 2: подключение submodule"

if git ls-files --error-unmatch "$PKG_PATH/composer.json" >/dev/null 2>&1; then
  git rm -r -q --cached "$PKG_PATH"
  ok "Папка убрана из индекса родительского репозитория"
fi

if [[ -d "$PKG_PATH" ]]; then
  BACKUP="$ROOT/../_backup_industry-showers_$(date +%Y%m%d_%H%M%S)"
  mv "$PKG_PATH" "$BACKUP"
  ok "Старая папка сохранена: $BACKUP (удалите, когда убедитесь, что всё работает)"
fi

mkdir -p "$(dirname "$PKG_PATH")"
# --force: переиспользует .git/modules/..., если submodule уже подключали в другой ветке
git submodule add --force -b "$BRANCH" "$REPO_URL" "$PKG_PATH"
git submodule update --init "$PKG_PATH"

# ---------- 3. composer.json: path-репозиторий и require ----------
say "Шаг 3: проверка composer.json"
if ! grep -q "$PKG_PATH" composer.json; then
  echo "  ! В composer.json нет path-репозитория для $PKG_PATH."
  echo "    Добавьте в \"repositories\":"
  echo "      { \"type\": \"path\", \"url\": \"$PKG_PATH\", \"options\": { \"symlink\": true } }"
fi
if ! grep -q "\"$COMPOSER_NAME\"" composer.json; then
  echo "  ! В \"require\" нет \"$COMPOSER_NAME\": \"@dev\"."
fi
grep -q "$PKG_PATH" composer.json && grep -q "\"$COMPOSER_NAME\"" composer.json && ok "composer.json в порядке"

# ---------- 4. Необязательно: остатки от «stone» ----------
if [[ $FIX_STONE -eq 1 ]]; then
  say "Шаг 4: замена stone → showers"
  for f in phpunit.xml makefile composer.json; do
    [[ -f "$f" ]] || continue
    sed -i \
      -e 's/ValerieStone/ValerieShowers/g' \
      -e 's/ValerieCctv/ValerieShowers/g' \
      -e 's#valerie/industry-stone#valerie/industry-showers#g' \
      -e 's#valerie/box-industry-stone#valerie/box-industry-showers#g' \
      -e 's/камня ValerieShowers/душевых ValerieShowers/g' \
      "$f"
  done
  ok "phpunit.xml, makefile, composer.json обновлены (проверьте git diff)"
fi

# ---------- 5. Коммит ----------
say "Шаг 5: коммит"
git add .gitmodules "$PKG_PATH"
[[ $FIX_STONE -eq 1 ]] && git add phpunit.xml makefile composer.json 2>/dev/null || true
git commit -m "Showers industry package as submodule ($BRANCH)"

cat <<EOF

Готово. Дальше:
  composer update $COMPOSER_NAME
  git push

В CI/Docker/deploy клонируйте с:  git clone --recurse-submodules <repo>
В уже склонированном репозитории: git submodule update --init
EOF
