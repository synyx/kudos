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
PostgreSQL Configuration Validation
*/}}
{{- define "kudos.validate.postgresql" -}}
{{- if not .Values.postgresql.host }}
{{- fail "postgresql.host is required - please specify your external PostgreSQL host" }}
{{- end }}
{{- if not .Values.postgresql.auth.existingSecret }}
{{- fail "postgresql.auth.existingSecret is required - please specify a secret containing database credentials" }}
{{- end }}
{{- end }}

{{/*
PostgreSQL secret name
*/}}
{{- define "kudos.postgresql.secretName" -}}
{{- .Values.postgresql.auth.existingSecret }}
{{- end }}

{{/*
PostgreSQL username secret key
*/}}
{{- define "kudos.postgresql.usernameKey" -}}
{{- .Values.postgresql.auth.usernameKey | default "username" }}
{{- end }}

{{/*
PostgreSQL password secret key
*/}}
{{- define "kudos.postgresql.passwordKey" -}}
{{- .Values.postgresql.auth.passwordKey | default "password" }}
{{- end }}

{{/*
Build DATABASE_URL with environment variable substitution
*/}}
{{- define "kudos.postgresql.connectionString" -}}
{{- $host := .Values.postgresql.host }}
{{- $port := .Values.postgresql.port | default 5432 | int }}
{{- $database := .Values.postgresql.database | default "kudos" }}
{{- $sslMode := .Values.postgresql.sslMode | default "disable" }}
{{- $baseUrl := printf "postgresql://$(DATABASE_USER):$(DATABASE_PASSWORD)@%s:%d/%s" $host $port $database }}
{{- if ne $sslMode "disable" }}
{{- printf "%s?sslmode=%s" $baseUrl $sslMode }}
{{- else }}
{{- $baseUrl }}
{{- end }}
{{- end }}
