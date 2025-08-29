{{/*
Expand the name of the chart.
*/}}
{{- define "kudos.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "kudos.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "kudos.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "kudos.labels" -}}
helm.sh/chart: {{ include "kudos.chart" . }}
{{ include "kudos.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "kudos.selectorLabels" -}}
app.kubernetes.io/name: {{ include "kudos.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
PostgreSQL helpers
*/}}
{{- define "kudos.postgresql.fullname" -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}-postgresql
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}-postgresql
{{- end -}}
{{- end -}}

{{/*
Return the proper PostgreSQL secret name
*/}}
{{- define "kudos.postgresql.secretName" -}}
{{- if eq .Values.postgres.mode "operator" -}}
    {{- $sanitizedUser := include "kudos.postgresql.user" . | replace "_" "-" | lower -}}
    {{- printf "%s.%s.credentials.postgresql.acid.zalan.do" $sanitizedUser .Values.postgres.operator.clusterName -}}
{{- else -}}
    {{- .Values.app.db.passwordSecret | default (printf "%s-postgresql" .Release.Name) -}}
{{- end -}}
{{- end -}}

{{/*
Return the proper PostgreSQL User (sanitized for Kubernetes)
*/}}
{{- define "kudos.postgresql.user.sanitized" -}}
{{- include "kudos.postgresql.user" . | replace "_" "-" | lower -}}
{{- end -}}

{{/*
Return the proper PostgreSQL User for connection (matches what's actually created)
*/}}
{{- define "kudos.postgresql.user.connection" -}}
{{- if eq .Values.postgres.mode "operator" -}}
    {{- include "kudos.postgresql.user.sanitized" . -}}
{{- else -}}
    {{- include "kudos.postgresql.user" . -}}
{{- end -}}
{{- end -}}

{{/*
Return the proper PostgreSQL SSL mode
*/}}
{{- define "kudos.postgresql.sslmode" -}}
{{- if eq .Values.postgres.mode "operator" -}}
    {{- .Values.postgres.operator.ssl.mode | default "require" -}}
{{- else -}}
    {{- .Values.app.db.ssl.mode | default "disable" -}}
{{- end -}}
{{- end -}}

{{/*
Build the complete DATABASE_URL with conditional SSL mode
*/}}
{{- define "kudos.postgresql.connectionString" -}}
{{- $host := include "kudos.postgresql.host" . -}}
{{- $port := include "kudos.postgresql.port" . -}}
{{- $database := include "kudos.postgresql.database" . -}}
{{- $baseUrl := printf "postgresql://$(DATABASE_USER):$(DATABASE_PASSWORD)@%s:%s/%s" $host $port $database -}}
{{- if eq .Values.postgres.mode "operator" -}}
{{- $sslmode := include "kudos.postgresql.sslmode" . -}}
{{- if ne $sslmode "disable" -}}
{{- printf "%s?sslmode=%s" $baseUrl $sslmode -}}
{{- else -}}
{{- $baseUrl -}}
{{- end -}}
{{- else -}}
{{- $baseUrl -}}
{{- end -}}
{{- end -}}

{{/*
Return the proper PostgreSQL secret key
*/}}
{{- define "kudos.postgresql.secretKey" -}}
{{- if eq .Values.postgres.mode "operator" -}}
{{- print "password" -}}
{{- else -}}
{{- print "postgres-password" -}}
{{- end -}}
{{- end -}}

{{/*
Return the proper PostgreSQL host
*/}}
{{- define "kudos.postgresql.host" -}}
{{- if eq .Values.postgres.mode "operator" -}}
    {{- printf "%s.%s.svc.cluster.local" .Values.postgres.operator.clusterName (default .Release.Namespace .Values.postgres.operator.namespace) -}}
{{- else if eq .Values.postgres.mode "selfcontained" -}}
    {{- template "kudos.postgresql.fullname" . -}}
{{- else if .Values.app.db.host }}
    {{- .Values.app.db.host -}}
{{- end -}}
{{- end -}}

{{/*
Return the proper PostgreSQL port
*/}}
{{- define "kudos.postgresql.port" -}}
{{- .Values.app.db.port | default 5432 -}}
{{- end -}}

{{/*
Return the proper PostgreSQL User
*/}}
{{- define "kudos.postgresql.user" -}}
{{- .Values.app.db.user | default "kudos" -}}
{{- end -}}

{{/*
Return the proper PostgreSQL Database
*/}}
{{- define "kudos.postgresql.database" -}}
{{- .Values.app.db.name | default "kudos" -}}
{{- end -}}

{{/*
Validate postgresql configuration.
*/}}
{{- define "kudos.validate.postgresql" -}}
{{- $validModes := list "operator" "selfcontained" }}
{{- if not (has .Values.postgres.mode $validModes) }}
{{- fail (printf "Invalid postgres.mode '%s'. Must be one of: %s" .Values.postgres.mode (join ", " $validModes)) }}
{{- end }}
{{- if eq .Values.postgres.mode "operator" }}
{{- if not .Values.postgres.operator.clusterName }}
{{- fail "postgres.operator.clusterName is required when postgres.mode is 'operator'" }}
{{- end }}
{{- if not .Values.postgres.operator.teamId }}
{{- fail "postgres.operator.teamId is required when postgres.mode is 'operator'" }}
{{- end }}
{{- end }}
{{- if eq .Values.postgres.mode "selfcontained" }}
{{- if not .Values.postgres.selfcontained.storage.size }}
{{- fail "postgres.selfcontained.storage.size is required when postgres.mode is 'selfcontained'" }}
{{- end }}
{{- end }}
{{- end -}}
