# Deploy no Orion Host — passos mínimos

Este documento descreve passos rápidos e seguros para subir a versão estática do site (exportada em `frontend/public_html`) no Orion Host.

1) Conteúdo a subir
- Faça upload do conteúdo de `frontend/public_html/*` para a pasta `public_html` do seu espaço na Orion.
- O arquivo de entrada deve ser `index.html` (todo em minúsculas) e estar diretamente em `public_html/index.html`.

2) .htaccess
- Foi gerado um `.htaccess` mínimo em `public_html/.htaccess` com: `DirectoryIndex index.html index.php` e `Options -Indexes`.
- Se você receber erro 403 (Proibido), renomeie `.htaccess` para `.htaccess.bak` e teste novamente — o painel da Orion aplica suas próprias regras.

3) _next e assets
- A pasta `_next` foi normalizada e contém assets estáticos gerados. Garanta que a pasta `_next` e `images/`, `icons/` estejam no `public_html`.

4) Permissões
- Ajuste permissões (se não for feito automaticamente):
```bash
# nas máquinas Linux/SSH
cd /caminho/para/public_html
find . -type d -exec chmod 755 {} +
find . -type f -exec chmod 644 {} +
```

5) Backend e formulários
- A versão atual é estática. Formulários de cadastro, autenticação e pagamento esperam endpoints de backend (ex: `/api/auth/register`, `/api/payments/create`). Para funcionamento pleno você deve:
  - subir o backend (Node/Express/Next API) em um servidor acessível e atualizar os formulários para apontar para a URL pública do backend, ou
  - implementar endpoints equivalentes no servidor (PHP/CGI) e ajustar o `action` dos formulários para a URL correta.

Exemplo rápido de `curl` para teste (substitua `SEU_BACKEND`):
```bash
curl -v -X POST https://SEU_BACKEND/api/auth/register \
  -F "name=Teste" -F "email=admin@example.com" -F "cpf=00000000000"
```

6) Conta admin (opção de emergência)
- Se você só precisa criar uma conta admin direto no banco, veja `admin_create.sql` neste repositório. Use com cuidado.

7) Service Worker / Cache
- Se o host estiver servindo uma versão previa com service worker (`sw.js` ou `service-worker.js`), limpe o cache do navegador (ou remova temporariamente os arquivos SW) para evitar comportamento antigo.

8) Testes pós-deploy
- Abra `https://SEU_DOMINIO/` e verifique:
  - `index.html` carrega sem 403/404
  - assets em `_next/static` e `images/` carregam (via DevTools)
  - formulários enviam para endpoints corretos (ou exibem mensagem de erro do backend)

9) Commit
- Eu já preparei e commitei as mudanças locais do repositório com correções e arquivos de suporte.

Se quiser, eu também posso:
- configurar um endpoint simples de teste para receber os formulários (esqueleto Node/Express),
- gerar um script de deploy por FTP/rsync para a Orion, ou
- criar instruções passo a passo para adicionar variáveis de ambiente e chaves de pagamento.
