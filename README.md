# API Documentation

### Base URL

```
http://localhost:5000/api
```

---

## User Routes

### 1. **User Registration**

- **Method**: `POST`
- **Endpoint**: `/api/users/register`
- **Description**: Registers a new user.
- **Request Body**:
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

### 2. **User Login**

- **Method**: `POST`
- **Endpoint**: `/api/users/login`
- **Description**: Logs in an existing user.
- **Request Body**:
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

---

## Static Routes

### 1. **Create Static**

- **Method**: `POST`
- **Endpoint**: `/api/statics`
- **Description**: Creates a new static team for the authenticated user.
- **Request Body**:
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

### 2. **Confirm Static**

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

### 3. **Add Member to Static**

- **Method**: `POST`
- **Endpoint**: `/api/statics/:id/members`
- **Description**: Adds a new member to the specified static team.
- **Parameters**: `id` - the ID of the static team
- **Request Body**:
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

### 4. **Get All Statics for User**

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

---

## FF Logs Routes

### 1. **Fetch Character Data**

- **Method**: `GET`
- **Endpoint**: `/api/fflogs/character/:name/:serverSlug/:serverRegion`
- **Description**: Retrieves character information and recent parses for a character.
- **URL Parameters**:
  - `name` - Character name (e.g., "Hixyllian Augurelt")
  - `serverSlug` - Server slug (e.g., "Ragnarok")
  - `serverRegion` - Server region (e.g., "EU")
- **Sample Response**:
  ```json
  {
    "characterInfo": {
      "canonicalID": 20389946,
      "name": "Hixyllian Augurelt",
      "lodestoneID": 23598721,
      "guildRank": 1,
      "guilds": [
        {
          "id": 124858,
          "name": "Aeterna Rebellio"
        }
      ],
      "bestHPSRankings": {
        "bestPerformanceAverage": 71.18845,
        "rankings": [
        {
          "encounterID": 93,
          "encounterName": "Black Cat",
          "rankPercent": 91.4281,
          "serverRank": 26,
          "regionRank": 331,
          "totalKills": 10,
          "bestAmount": 14428.709569555,
          "spec": "Astrologian"
        }
        ]
        },
        "bestDPSRankings": { 
        "bestPerformanceAverage": 29.4040475,
        "rankings": [
        {
          "encounterID": 93,
          "encounterName": "Black Cat",
          "rankPercent": 52.3832,
          "serverRank": 200,
          "regionRank": 2776,
          "totalKills": 10,
          "bestAmount": 12896.585326568,
          "spec": "WhiteMage"
        }
        ]
        }
    },
    "RecentParses": [
      {
        "encounterID": 96,
        "encounterName": "Wicked Thunder",
        "rank": 8604,
        "regionRank": 422,
        "serverRank": 38,
        "totalKills": 10
      }
    ]
  }
  ```

---

### Notes

- **Tokens**: To ensure connection to db and all requests requiring authentication are sent with a valid token in the headers.
- **Environment Variables**: `.env` file should contain:
  ```env
  FF_LOGS_CLIENT_ID=your_client_id
  FF_LOGS_CLIENT_SECRET=your_client_secret
  FF_LOGS_API_KEY=your_v1_api_key
  MONGO_URI=your_db_url
  JWT_SECRET=your_JWT_secret_key
  PORT=your_port
  ```

---
