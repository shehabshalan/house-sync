# HouseSync

HouseSync is web-based app built to help roommates manage their household. It allows users to create spaces, add roommates, create recurring chores (tasks) and shopping lists.

The app implements an easy to use login process using Google OAuth 2.0.

## Getting Started

The app is built using FastAPI, React and Shadcn UI. To run the app locally, you will need to install the following:

- Python >=3.11
- Node.js >=18.0
- PostgreSQL >=15.0

### API

1. Clone the repo
2. Navigate to the `api` directory

```bash
cd api
```

3. Create a virtual environment and install the dependencies

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory and copy the contents of `.env.example` into it. Add the following variables:

```
cp .env.example .env
```

```bash
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
GOOGLE_CLIENT_ID=<google_client_id>
GOOGLE_CLIENT_SECRET=<google_client_secret>
```

5. Run the migrations

```bash
alembic upgrade head
```

6. Run the backend server

```bash
python -m app.main
```

### Frontend

1. Navigate to the `client` directory

```bash
cd client
```

2. Install the dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory and copy the contents of `.env.example` into it. Add the following variables:

```
cp .env.example .env
```

```bash
VITE_GOOGLE_CLIENT_ID=
VITE_PROD_BASE_URL=
VITE_DEV_BASE_URL=
```

4. Run the frontend server

```bash
npm run dev
```

## Built With

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [React Query](https://react-query.tanstack.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [SQLModel](https://sqlmodel.tiangolo.com/)
- [PostgreSQL](https://www.postgresql.org/)
