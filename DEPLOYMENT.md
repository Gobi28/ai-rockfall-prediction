# Deployment

## 1. Create the cloud database

Create a MongoDB Atlas cluster, database user, and network access rule. Keep the Atlas connection string private.

## 2. Copy local data to Atlas

From `backend`, set the two connection strings in the shell or deployment environment:

```powershell
$env:SOURCE_MONGO_URI = "mongodb://127.0.0.1:27017/ai_mine_prediction"
$env:MONGO_URI = "mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/ai_mine_prediction"
npm run migrate:cloud
```

The migration uses upserts and copies the `predictions` and `alerts` collections without deleting the cloud data.

## 3. Deploy the backend

Use the repository's `backend/Dockerfile` on a container host such as Render or Railway. Configure:

```text
MONGO_URI=<Atlas connection string>
FRONTEND_URL=<deployed frontend URL>
PORT=5000
PYTHON_PATH=python3
```

The service health check is:

```text
/health
```

## 4. Deploy the frontend

Set this environment variable in the frontend host:

```text
VITE_API_URL=https://<deployed-backend-host>
```

Do not include `/api`; the frontend adds that path itself.

## 5. Atlas network access

For a first demo deployment, allow the backend host's outbound IP range in Atlas. Avoid committing credentials or putting `MONGO_URI` in frontend variables.
