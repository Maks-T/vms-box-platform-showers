#!/bin/bash

# deploy-hook.sh

set -e # Останавливать выполнение при любых ошибках

BRANCH_NAME=${1:-"deploy/build"}

echo "Обновление статических файлов виджета калькулятора (Ветка: $BRANCH_NAME)..."

rm -rf public/widget

git clone -b "$BRANCH_NAME" --single-branch git@github.com:kapitulin24/showers.git public/widget

rm -rf public/widget/.git

chown -R www-data:www-data public/widget
chmod -R 775 public/widget

echo "Виджет успешно обновлен."
