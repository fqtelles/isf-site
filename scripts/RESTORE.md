# Restauração de Backup — ISF Segurança

## Pré-requisitos

- Acesso SSH à VPS (`ssh root@45.85.146.56`)
- `rclone` configurado com o remote `gdrive` (já feito pelo `setup-backup.sh`)
- `sqlite3` instalado na VPS

---

## 1. Listar backups disponíveis no Google Drive

```bash
rclone lsd gdrive:ISF-Backups/
```

Isso mostra as pastas de backup por data, ex:

```
2026-04-01_03-00-00
2026-03-31_03-00-00
2026-03-30_03-00-00
```

---

## 2. Baixar o backup desejado

```bash
# Substitua YYYY-MM-DD_HH-MM-SS pela data do backup desejado
BACKUP="2026-04-01_03-00-00"
RESTORE_DIR="/var/backups/isf-restore/$BACKUP"

mkdir -p "$RESTORE_DIR"
rclone copy "gdrive:ISF-Backups/$BACKUP/" "$RESTORE_DIR/" --progress
```

Verifique os arquivos baixados:

```bash
ls -lh "$RESTORE_DIR/"
# Esperado: database.sqlite, public.tar.gz, config.tar.gz
```

---

## 3. Parar a aplicação

```bash
pm2 stop isf-site
```

---

## 4. Restaurar o banco de dados

```bash
# Backup do banco atual (por segurança)
cp /var/www/isf-site/prisma/dev.db /var/www/isf-site/prisma/dev.db.antes-restore

# Restaurar
cp "$RESTORE_DIR/database.sqlite" /var/www/isf-site/prisma/dev.db
```

---

## 5. Restaurar a pasta public/

```bash
# Backup da pasta atual (por segurança)
mv /var/www/isf-site/public /var/www/isf-site/public.antes-restore

# Restaurar
tar -xzf "$RESTORE_DIR/public.tar.gz" -C /var/www/isf-site/
```

---

## 6. Restaurar arquivos de configuração (opcional)

Só faça isso se os arquivos de config foram perdidos ou corrompidos.

```bash
# Extrair configs para uma pasta temporária
tar -xzf "$RESTORE_DIR/config.tar.gz" -C "$RESTORE_DIR/"

# Restaurar seletivamente (revise antes de copiar!)
ls "$RESTORE_DIR/config/"

# Exemplos:
cp "$RESTORE_DIR/config/.env" /var/www/isf-site/.env
cp "$RESTORE_DIR/config/prisma/schema.prisma" /var/www/isf-site/prisma/schema.prisma
cp "$RESTORE_DIR/config/ecosystem.config.js" /var/www/isf-site/ecosystem.config.js
cp -r "$RESTORE_DIR/config/nginx/" /var/www/isf-site/nginx/
```

Se restaurou o `nginx/isf-site.conf`, recarregue o Nginx:

```bash
cp /var/www/isf-site/nginx/isf-site.conf /etc/nginx/sites-available/isf-site
nginx -t && systemctl reload nginx
```

---

## 7. Reiniciar a aplicação

```bash
pm2 start isf-site
```

Verifique se está rodando:

```bash
pm2 status
pm2 logs isf-site --lines 20
```

---

## 8. Verificar o site

```bash
curl -I https://isf.com.br
```

Abra https://isf.com.br no navegador e confirme que:
- [ ] A página inicial carrega normalmente
- [ ] As imagens aparecem
- [ ] O painel admin funciona (`/admin`)
- [ ] Os produtos e posts do blog estão presentes

---

## 9. Limpar arquivos temporários

Após confirmar que tudo está funcionando:

```bash
# Remover pasta de restore
rm -rf /var/backups/isf-restore/

# Remover backups de segurança (só depois de confirmar que tudo funciona!)
rm -f /var/www/isf-site/prisma/dev.db.antes-restore
rm -rf /var/www/isf-site/public.antes-restore
```

---

## Restauração de emergência (VPS nova)

Se precisar restaurar em uma VPS completamente nova:

```bash
# 1. Rodar o setup inicial
bash /var/www/isf-site/scripts/setup-vps.sh

# 2. Configurar rclone na nova VPS
bash /var/www/isf-site/scripts/setup-backup.sh

# 3. Seguir os passos 1-8 acima para restaurar o backup
```

---

## Resumo rápido (copiar e colar)

```bash
# Escolha a data do backup
BACKUP="2026-04-01_03-00-00"

# Baixar
mkdir -p /var/backups/isf-restore/$BACKUP
rclone copy "gdrive:ISF-Backups/$BACKUP/" "/var/backups/isf-restore/$BACKUP/" --progress

# Parar o site
pm2 stop isf-site

# Restaurar banco
cp /var/www/isf-site/prisma/dev.db /var/www/isf-site/prisma/dev.db.antes-restore
cp "/var/backups/isf-restore/$BACKUP/database.sqlite" /var/www/isf-site/prisma/dev.db

# Restaurar public/
mv /var/www/isf-site/public /var/www/isf-site/public.antes-restore
tar -xzf "/var/backups/isf-restore/$BACKUP/public.tar.gz" -C /var/www/isf-site/

# Reiniciar
pm2 start isf-site

# Verificar
curl -I https://isf.com.br
pm2 logs isf-site --lines 20
```
