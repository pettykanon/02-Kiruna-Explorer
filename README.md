# Kiruna Explorer

## Table of Contents

1. [Introduction](#1-introduction)
2. [Technologies Used](#2-technologies-used)
3. [Database Structure](#3-database-structure)
4. [API Documentation](#4-api-documentation)

### 1. Introduction

### 2. Technologies Used

- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: sqlite

### 3. Database Structure

- **users Table**

  - `id` (Integer) - (Primary Key)
  - `role` (String) - limited to "urban_planner", "resident", and "visitor" values.

- **document Table**

  - `id` (Integer) - (Primary Key)
  - `title` (String)
  - `description` (String)
  - `areaId` (String) - (Foreign Key)

- **area Table**

  - `id` (Integer) - (Primary Key)
  - `geoJson` (String/JSON) - Coordinate(s)

- **document_link Table**
  - `id` (Integer) - (Primary Key)
  - `doc1Id` (Integer) - (Foreign Key)
  - `doc2Id` (Integer) - (Foreign Key)
  - `date` (String)
  - `connection` (String) - limited to "direct_consequence", "collateral_consequence", "prevision", and "update" values.

### 4. API Documentation

#### Add Document

- **POST** `api/documents`
  - Body: All document fields with or without area ID
  - return: success

If not already present area, first he has to create one

- **GET** `api/documents`

  - No body
  - Response: id, title, stakeholders, date, type

- **GET** `api/documents/:DocId`

  - req param: Document Id
  - returns all of document with id

#### Link Document:

- **POST** `api/documents/link`

  - Body: DocId1 , DocId2, type, date
  - return success

- **GET** `api/documents/link/:DocId`

  - req param: Document Id
  - return: Id, title and type of linked documents

#### Geolocate Document:

- **POST** `api/documents/area`

  - Body: Geo json
  - return: success

- **GET** `api/documents/area`

  - No body
  - return all areas

- **GET** `api/documents/area/:areaId`

  - No body
  - return all documents in a specific area
