#!/usr/bin/env bash

set -euo pipefail

readonly registry="https://registry.npmjs.org/"
readonly auth_key="//registry.npmjs.org/:_authToken"

get_user_config() {
  local config_path config_dir repo_root
  config_path="$(npm config get userconfig)"
  config_dir="$(cd "$(dirname "$config_path")" && pwd -P)"
  config_path="$config_dir/$(basename "$config_path")"
  repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"

  if [[ -n "$repo_root" ]] && { [[ "$config_path" == "$repo_root" ]] || [[ "$config_path" == "$repo_root/"* ]]; }; then
    echo "refusing npm userconfig inside the repository" >&2
    return 1
  fi
  if [[ -L "$config_path" ]]; then
    echo "refusing symlinked npm userconfig" >&2
    return 1
  fi

  printf '%s\n' "$config_path"
}

check_auth() {
  local user_config
  user_config="$(get_user_config)"

  if [[ ! -f "$user_config" ]] || ! grep -Eq '^[[:space:]]*//registry\.npmjs\.org/:_authToken[[:space:]]*=[[:space:]]*[^[:space:]]+' "$user_config"; then
    echo "npm granular token is not configured in the user npmrc" >&2
    return 1
  fi

  if ! npm whoami --registry "$registry" >/dev/null 2>&1; then
    echo "npm authentication failed; the configured token may be invalid or expired" >&2
    return 1
  fi

  echo "npm authentication is configured"
}

if [[ "${1:-}" == "--check" ]]; then
  check_auth
  exit
fi

if [[ -n "${1:-}" ]]; then
  echo "usage: $0 [--check]" >&2
  exit 2
fi

if [[ ! -t 0 ]]; then
  echo "run this helper in an interactive terminal" >&2
  exit 2
fi

read -r -s -p "npm granular token: " npm_release_token
printf '\n'

if [[ -z "$npm_release_token" ]] || [[ "$npm_release_token" == *$'\n'* ]]; then
  unset npm_release_token
  echo "token is empty or malformed" >&2
  exit 1
fi

user_config="$(get_user_config)"
printf '%s' "$npm_release_token" | node -e '
const fs = require("node:fs");
const path = process.argv[1];
const key = "//registry.npmjs.org/:_authToken";
const token = fs.readFileSync(0, "utf8");
const current = fs.existsSync(path) ? fs.readFileSync(path, "utf8") : "";
const lines = current.split(/\r?\n/).filter(line => !/^\s*\/\/registry\.npmjs\.org\/:_authToken\s*=/.test(line));
while (lines.at(-1) === "") lines.pop();
lines.push(`${key}=${token}`, "");
const temporary = `${path}.npm-release-${process.pid}`;
fs.writeFileSync(temporary, lines.join("\n"), { mode: 0o600 });
fs.renameSync(temporary, path);
fs.chmodSync(path, 0o600);
' "$user_config"
unset npm_release_token

check_auth
