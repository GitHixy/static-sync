
# API Documentation

## User Routes

### 1. User Registration
- **Method**: `POST`
- **Endpoint**: `/api/users/register`
- **Description**: Registers a new user.
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "user_id",
    "username": "string",
    "email": "string",
    "token": "jwt_token"
  }
  ```

### 2. User Login
- **Method**: `POST`
- **Endpoint**: `/api/users/login`
- **Description**: Logs in an existing user.
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "user_id",
    "username": "string",
    "email": "string",
    "token": "jwt_token"
  }
  ```

## Static Routes

### 1. Create Static
- **Method**: `POST`
- **Endpoint**: `/api/statics`
- **Description**: Creates a new static team for the authenticated user.
- **Body**:
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "static_id",
    "owner": "user_id",
    "name": "string",
    "description": "string",
    "members": [],
    "isComplete": false
  }
  ```

### 2. Confirm Static
- **Method**: `POST`
- **Endpoint**: `/api/statics/:id/confirm`
- **Description**: Confirms that the static team has the correct role composition.
- **Parameters**: `id` - the ID of the static team
- **Response**:
  ```json
  {
    "message": "Static is complete and confirmed!"
  }
  ```
  - **Error**:
  ```json
  {
    "message": "The static does not have the correct composition of roles."
  }
  ```

### 3. Add Member to Static
- **Method**: `POST`
- **Endpoint**: `/api/statics/:id/members`
- **Description**: Adds a new member to the specified static team.
- **Parameters**: `id` - the ID of the static team
- **Body**:
  ```json
  {
    "playerId": "fflogs_player_id",
    "name": "Player Name",
    "role": "Tank",
    "class": "Warrior"
  }
  ```
- **Response**:
  ```json
  {
    "_id": "static_id",
    "owner": "user_id",
    "name": "string",
    "description": "string",
    "members": [
      {
        "playerId": "fflogs_player_id",
        "name": "Player Name",
        "role": "Tank",
        "class": "Warrior",
        "isConfirmed": false
      }
    ],
    "isComplete": false
  }
  ```

### 4. Get All Statics for User
- **Method**: `GET`
- **Endpoint**: `/api/statics`
- **Description**: Retrieves all statics created by the authenticated user.
- **Response**:
  ```json
  [
    {
      "_id": "static_id",
      "owner": "user_id",
      "name": "string",
      "description": "string",
      "members": [],
      "isComplete": false
    }
  ]
  ```
