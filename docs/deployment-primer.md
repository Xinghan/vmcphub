---
title: Deploying MCP on VMware Private AI Foundation
---

# Deploying MCP servers on VMware Private AI Foundation

This page covers the patterns that all per-entry deployment guides build on.

## Cluster prerequisites

- VMware Private AI Foundation 2.x
- A namespace dedicated to MCP workloads
- Service accounts scoped per-server

## Image distribution

MCP server images are pulled from your internal registry. Mirror the upstream
image into a registry your PAIF cluster trusts.

## Secrets

Use Kubernetes Secrets for per-server credentials. Avoid baking credentials
into images or ConfigMaps.

## Networking

Expose MCP servers via in-cluster Services. Only egress to upstream targets
(vCenter, NSX, Confluence, etc.) needs to leave the cluster.

## Verification

Each MCP server image should expose `/healthz`. Use a Kubernetes liveness
probe on it.
