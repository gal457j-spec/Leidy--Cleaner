#!/bin/bash
set -e

# Simple Let's Encrypt + Nginx automation helper (requires certbot on host)
# Usage: sudo ./setup-ssl-letsencrypt.sh yourdomain.com email@domain.com

if [ "$EUID" -ne 0 ]; then
  echo "Please run as root: sudo $0 <domain> <email>"
  exit 1
fi

DOMAIN="$1"
EMAIL="$2"

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  echo "Usage: sudo $0 <domain> <email>"
  exit 1
fi

echo "Stopping nginx to allow certbot to bind..."
systemctl stop nginx || true

echo "Requesting certificate for $DOMAIN"
certbot certonly --nginx --non-interactive --agree-tos --email "$EMAIL" -d "$DOMAIN"

echo "Configuring nginx to use certificates"
# NOTE: user must adapt nginx.prod.conf to point to /etc/letsencrypt/live/$DOMAIN/fullchain.pem
systemctl start nginx

echo "Certificate requested. Please verify /etc/letsencrypt/live/$DOMAIN/"
echo "Remember to configure automatic renewal: systemctl enable certbot.timer"
