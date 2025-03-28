#!/usr/bin/env bash

CURRENT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NPM="${CURRENT_DIR}"/npm.sh
WORKDIR="$(dirname "$CURRENT_DIR")"
BIN_PATH="${WORKDIR}"/bin

chmod +x "${BIN_PATH}"/npm

EXPORT_ZSHRC="export PATH=\"$BIN_PATH:\$PATH\""

if ! grep -Fxq "$EXPORT_ZSHRC" ~/.zshrc; then
    echo "" >> ~/.zshrc
    echo "$EXPORT_ZSHRC" >> ~/.zshrc
fi

exec zsh