#!/bin/bash

# ============================================
# 🚀 LEIDY CLEANER - BACKUP AUTOMÁTICO
# ============================================
# Sistema de backup completo com:
# - Backup do banco de dados
# - Backup de arquivos enviados
# - Rotação automática (30 dias)
# - Upload para cloud storage (opcional)
# - Verificação de integridade
# ============================================

set -e  # Exit on any error

# Configurações
BACKUP_DIR="/workspaces/Leidy--Cleaner/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="leidy_backup_${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"
RETENTION_DAYS=30

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função de log
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Criar diretório de backup se não existir
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        log "Diretório de backup criado: $BACKUP_DIR"
    fi
}

# Backup do banco de dados
backup_database() {
    log "Iniciando backup do banco de dados..."

    local db_file="/workspaces/Leidy--Cleaner/backend/data/data.db"

    if [ ! -f "$db_file" ]; then
        log_error "Arquivo de banco de dados não encontrado: $db_file"
        return 1
    fi

    # Criar backup do SQLite
    cp "$db_file" "${BACKUP_PATH}/database.db"

    # Verificar se o backup foi criado com sucesso
    if [ -f "${BACKUP_PATH}/database.db" ]; then
        local original_size=$(stat -f%z "$db_file" 2>/dev/null || stat -c%s "$db_file" 2>/dev/null)
        local backup_size=$(stat -f%z "${BACKUP_PATH}/database.db" 2>/dev/null || stat -c%s "${BACKUP_PATH}/database.db" 2>/dev/null)

        if [ "$original_size" = "$backup_size" ]; then
            log_success "Backup do banco criado com sucesso (${backup_size} bytes)"
        else
            log_warning "Backup criado mas tamanhos diferem (original: ${original_size}, backup: ${backup_size})"
        fi
    else
        log_error "Falha ao criar backup do banco de dados"
        return 1
    fi
}

# Backup de arquivos enviados
backup_uploads() {
    log "Iniciando backup de arquivos enviados..."

    local uploads_dir="/workspaces/Leidy--Cleaner/backend/uploads"

    if [ -d "$uploads_dir" ]; then
        # Criar tar.gz dos uploads
        cd "$uploads_dir"
        tar -czf "${BACKUP_PATH}/uploads.tar.gz" . 2>/dev/null || true

        if [ -f "${BACKUP_PATH}/uploads.tar.gz" ]; then
            local size=$(stat -f%z "${BACKUP_PATH}/uploads.tar.gz" 2>/dev/null || stat -c%s "${BACKUP_PATH}/uploads.tar.gz" 2>/dev/null)
            log_success "Backup de uploads criado com sucesso (${size} bytes)"
        else
            log_warning "Nenhum arquivo de upload encontrado ou falha na compressão"
        fi
    else
        log_warning "Diretório de uploads não encontrado: $uploads_dir"
    fi
}

# Backup de configurações críticas
backup_configs() {
    log "Iniciando backup de configurações..."

    # Arquivos de configuração (sem senhas)
    local config_files=(
        "/workspaces/Leidy--Cleaner/docker-compose.yml"
        "/workspaces/Leidy--Cleaner/docker-compose.prod.yml"
        "/workspaces/Leidy--Cleaner/nginx.prod.conf"
        "/workspaces/Leidy--Cleaner/backend/package.json"
        "/workspaces/Leidy--Cleaner/frontend/package.json"
    )

    for config_file in "${config_files[@]}"; do
        if [ -f "$config_file" ]; then
            local filename=$(basename "$config_file")
            cp "$config_file" "${BACKUP_PATH}/${filename}"
        fi
    done

    log_success "Backup de configurações criado"
}

# Criar arquivo de metadados do backup
create_metadata() {
    log "Criando metadados do backup..."

    local metadata_file="${BACKUP_PATH}/backup_metadata.json"

    cat > "$metadata_file" << EOF
{
  "backup_name": "$BACKUP_NAME",
  "timestamp": "$TIMESTAMP",
  "created_at": "$(date -Iseconds)",
  "version": "1.0",
  "project": "Leidy Cleaner",
  "components": {
    "database": "SQLite",
    "uploads": "Arquivos enviados",
    "configs": "Configurações do sistema"
  },
  "retention_days": $RETENTION_DAYS,
  "server_info": {
    "hostname": "$(hostname)",
    "os": "$(uname -s)",
    "arch": "$(uname -m)"
  }
}
EOF

    log_success "Metadados criados"
}

# Verificar integridade do backup
verify_backup() {
    log "Verificando integridade do backup..."

    local total_files=$(find "$BACKUP_PATH" -type f | wc -l)
    local total_size=$(du -sb "$BACKUP_PATH" 2>/dev/null | cut -f1)

    if [ "$total_files" -gt 0 ]; then
        log_success "Backup verificado: $total_files arquivos, $total_size bytes"
        return 0
    else
        log_error "Backup vazio ou corrompido"
        return 1
    fi
}

# Limpar backups antigos
cleanup_old_backups() {
    log "Limpando backups antigos (retenção: ${RETENTION_DAYS} dias)..."

    local deleted_count=0

    # Encontrar backups antigos
    find "$BACKUP_DIR" -name "leidy_backup_*.tar.gz" -type f -mtime +$RETENTION_DAYS -print0 2>/dev/null | while IFS= read -r -d '' old_backup; do
        rm -f "$old_backup"
        ((deleted_count++))
    done

    # Limpar diretórios de backup antigos
    find "$BACKUP_DIR" -name "leidy_backup_*" -type d -mtime +$RETENTION_DAYS -print0 2>/dev/null | while IFS= read -r -d '' old_dir; do
        rm -rf "$old_dir"
        ((deleted_count++))
    done

    if [ "$deleted_count" -gt 0 ]; then
        log_success "$deleted_count backups antigos removidos"
    else
        log "Nenhum backup antigo para limpar"
    fi
}

# Compactar backup final
compress_backup() {
    log "Compactando backup final..."

    local final_backup="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"

    cd "$BACKUP_DIR"
    tar -czf "$final_backup" "$BACKUP_NAME" 2>/dev/null

    if [ -f "$final_backup" ]; then
        local size=$(stat -f%z "$final_backup" 2>/dev/null || stat -c%s "$final_backup" 2>/dev/null)
        log_success "Backup compactado: $final_backup (${size} bytes)"

        # Remover diretório temporário
        rm -rf "$BACKUP_PATH"
    else
        log_error "Falha ao compactar backup"
        return 1
    fi
}

# Upload para cloud storage (opcional)
upload_to_cloud() {
    if [ -n "$AWS_S3_BUCKET" ] && command -v aws &> /dev/null; then
        log "Fazendo upload para AWS S3..."

        local final_backup="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"

        if aws s3 cp "$final_backup" "s3://${AWS_S3_BUCKET}/backups/" --quiet; then
            log_success "Upload para S3 realizado com sucesso"
        else
            log_warning "Falha no upload para S3"
        fi
    fi
}

# Enviar notificação de backup
send_notification() {
    local status=$1
    local message=$2

    # Aqui poderia integrar com o NotificationService
    # Por enquanto, apenas log
    if [ "$status" = "success" ]; then
        log_success "BACKUP CONCLUÍDO: $message"
    else
        log_error "BACKUP FALHADO: $message"
    fi
}

# Função principal
main() {
    log "🚀 Iniciando backup automático do Leidy Cleaner"

    # Verificar se estamos no diretório correto
    if [ ! -d "/workspaces/Leidy--Cleaner" ]; then
        log_error "Diretório do projeto não encontrado. Execute este script de dentro do projeto."
        exit 1
    fi

    # Criar estrutura de backup
    create_backup_dir
    mkdir -p "$BACKUP_PATH"

    local success=true
    local error_message=""

    # Executar backup
    if ! backup_database; then
        success=false
        error_message="Falha no backup do banco de dados"
    fi

    if ! backup_uploads; then
        success=false
        error_message="${error_message}; Falha no backup de uploads"
    fi

    backup_configs

    if ! create_metadata; then
        success=false
        error_message="${error_message}; Falha na criação de metadados"
    fi

    if ! verify_backup; then
        success=false
        error_message="${error_message}; Verificação de integridade falhou"
    fi

    if ! compress_backup; then
        success=false
        error_message="${error_message}; Falha na compactação"
    fi

    # Limpeza
    cleanup_old_backups

    # Upload para cloud (opcional)
    upload_to_cloud

    # Resultado final
    if [ "$success" = true ]; then
        local final_backup="${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
        send_notification "success" "Backup criado com sucesso: $final_backup"
        log_success "🎉 Backup concluído com sucesso!"
        exit 0
    else
        send_notification "error" "$error_message"
        log_error "💥 Backup falhou: $error_message"
        exit 1
    fi
}

# Executar função principal
main "$@"