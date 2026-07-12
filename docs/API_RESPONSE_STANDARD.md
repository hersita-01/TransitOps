# Standardized API Response Contract

## Overview

To guarantee seamless interaction between the Frontend client (`client/`) and Backend server (`server/`), all REST API endpoints **MUST** adhere strictly to the JSON payload schemas documented below.

> **IMPORTANT**: This document defines response specifications only. Do not implement application APIs during Sprint 0.

---

## 1. Success Response Contract

Used for all successful HTTP operations (`200 OK`, `201 Created`).

### Specification

```json
{
  "success": true,
  "message": "Human-readable summary message describing operation success",
  "data": {}
}
```

### Field Definitions

- **`success`** (`boolean`, required): Must always be `true` for successful operations.
- **`message`** (`string`, required): Descriptive summary of the operation outcome.
- **`data`** (`object | array`, required): Payload containing requested resource details or mutation confirmation.

### Example Response

```json
{
  "success": true,
  "message": "Vehicle location retrieved successfully",
  "data": {
    "vehicleId": "V-104",
    "latitude": 37.7749,
    "longitude": -122.4194,
    "status": "IN_SERVICE"
  }
}
```

---

## 2. Failure Response Contract

Used for all client errors (`400 Bad Request`, `401 Unauthorized`, `404 Not Found`) and server exceptions (`500 Internal Server Error`).

### Specification

```json
{
  "success": false,
  "message": "Human-readable summary describing error condition",
  "errors": []
}
```

### Field Definitions

- **`success`** (`boolean`, required): Must always be `false` for failed requests.
- **`message`** (`string`, required): Primary summary of why the operation failed.
- **`errors`** (`array`, required): Array of detailed error objects or validation failure strings.

### Example Response

```json
{
  "success": false,
  "message": "Route validation failed",
  "errors": [
    {
      "field": "routeId",
      "detail": "Route ID is required and must follow format R-XXX"
    }
  ]
}
```
