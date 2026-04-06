#!/bin/sh
set -eu

cd /var/www/html

until wp core is-installed --allow-root >/dev/null 2>&1; do
  if wp core install \
    --url="${WORDPRESS_SITE_URL}" \
    --title="${WORDPRESS_SITE_TITLE}" \
    --admin_user="${WORDPRESS_ADMIN_USER}" \
    --admin_password="${WORDPRESS_ADMIN_PASSWORD}" \
    --admin_email="${WORDPRESS_ADMIN_EMAIL}" \
    --skip-email \
    --allow-root >/dev/null 2>&1; then
    echo "WordPress installed."
    break
  fi
  echo "Waiting for WordPress to be ready..."
  sleep 5
done

wp plugin install advanced-custom-fields --activate --allow-root || true
wp rewrite structure '/%postname%/' --allow-root >/dev/null 2>&1 || true
wp rewrite flush --allow-root >/dev/null 2>&1 || true

# Seed one home content entry if none exists.
if ! wp post list --post_type=rivulet_home --format=ids --allow-root | grep -q '[0-9]'; then
  wp post create \
    --post_type=rivulet_home \
    --post_status=publish \
    --post_title='Home Content' \
    --allow-root >/dev/null 2>&1 || true
fi

echo "WordPress bootstrap complete."
