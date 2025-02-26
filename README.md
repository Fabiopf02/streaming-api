## Deployment

```bash
$ cp .env.example .env # set variables values
$ export DOMAIN_NAME= # domain for certbot
$ export EMAIL= # e-mail for certbot
$ chmod +x init-letsencrypt.sh
$ ./init-letsencrypt.sh
$ docker compose --env-file .env up -d
```
