# Database Schema Documentation

## Overview
This document describes the database schema for the Weekly Planner application, which uses MongoDB with Mongoose ODM.

## Collections

### 1. Users Collection

**Collection Name:** `users`

**Schema Fields:**
```javascript
{
  username: String (required, unique)
  email: String (required, unique)
  password: String (required, hashed)
  hobbies: [String] (default: [])
  freeTime: [
    {
      day: String (required) // e.g., "Monday", "Tuesday"
      start: String (required) // e.g., "14:00", "09:30"
      end: String (required)   // e.g., "16:00", "11:30"
    }
  ] (default: [])
  currentLocation: String (default: "")
  planners: [ObjectId] (references to Planner documents)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

**Indexes:**
- `username` (unique)
- `email` (unique)

**Relationships:**
- One-to-Many with Planners (via `planners` array)

### 2. Planners Collection

**Collection Name:** `planners`

**Schema Fields:**
```javascript
{
  user: ObjectId (required, references User)
  hobbies: [String] (default: [])
  freeTime: [
    {
      day: String (required)
      start: String (required)
      end: String (required)
    }
  ] (default: [])
  currentLocation: String (default: "")
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

**Indexes:**
- `user` (for efficient user-based queries)

**Relationships:**
- Many-to-One with Users (via `user` field)

## Data Types

### Time Format
- **Format:** 24-hour format as strings
- **Examples:** "09:00", "14:30", "18:45"

### Day Format
- **Format:** Full day names as strings
- **Examples:** "Monday", "Tuesday", "Wednesday"

### Location Format
- **Format:** String representation of location
- **Examples:** "Tel Aviv, Israel", "New York, NY"

## Validation Rules

### User Validation
- Username: Required, unique, non-empty string
- Email: Required, unique, valid email format
- Password: Required, minimum 6 characters (hashed with bcrypt)
- Hobbies: Array of strings, optional
- FreeTime: Array of time slot objects, optional
- CurrentLocation: String, optional

### Planner Validation
- User: Required, valid ObjectId reference
- Hobbies: Array of strings, optional
- FreeTime: Array of time slot objects, optional
- CurrentLocation: String, optional

### Time Slot Validation
- Day: Required, non-empty string
- Start: Required, time format string
- End: Required, time format string
- Start time must be before end time

## Example Documents

### User Document
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "$2b$10$hashedpasswordstring...",
  "hobbies": ["reading", "swimming", "cooking"],
  "freeTime": [
    {
      "day": "Monday",
      "start": "18:00",
      "end": "20:00"
    },
    {
      "day": "Wednesday",
      "start": "14:00",
      "end": "16:00"
    }
  ],
  "currentLocation": "Tel Aviv, Israel",
  "planners": ["507f1f77bcf86cd799439012"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T15:45:00.000Z"
}
```

### Planner Document
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "user": "507f1f77bcf86cd799439011",
  "hobbies": ["reading", "swimming"],
  "freeTime": [
    {
      "day": "Monday",
      "start": "18:00",
      "end": "20:00"
    }
  ],
  "currentLocation": "Tel Aviv, Israel",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

## Security Considerations

- Passwords are hashed using bcrypt with salt rounds of 10
- User authentication is required for most operations
- Input validation is performed on all endpoints
- CORS is enabled for cross-origin requests

## Performance Considerations

- Indexes on frequently queried fields (username, email, user)
- Timestamps for tracking document changes
- Efficient references between collections
- Array fields for hobbies and free time to avoid additional collections
