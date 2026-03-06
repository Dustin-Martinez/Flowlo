# Flowlo – Database setup (step-by-step)

Follow these steps in order. Do not skip steps.

---

## Step 1: Install MySQL (if you don’t have it)

1. Download MySQL: https://dev.mysql.com/downloads/installer/
2. Run the installer.
3. Remember the **root password** you set.
4. Keep default port **3306** unless you need something else.

---

## Step 2: Create the database in MySQL Workbench

1. Open **MySQL Workbench**.
2. Connect to your server (e.g. **Local instance MySQL**).
3. Enter the root password if asked.
4. In the query tab, run:
   ```sql
   CREATE DATABASE flowlo;
   ```
5. Click the lightning icon (Execute) or press `Ctrl+Enter`.
6. You should see “1 row(s) affected”. The database `flowlo` is now created.
7. Do **not** create any tables here. Prisma will create them.

---

## Step 3: Create your `.env` file in the project

1. Open your Flowlo project folder in the editor (where `package.json` is).
2. Copy the example env file:
   - Copy `.env.example` and rename the copy to `.env`
   - Or create a new file named `.env` in the **same folder as `package.json`** (project root).
3. Open `.env` and set the database URL. Replace with your real values:
   ```env
   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/flowlo"
   ```
   - `root` = your MySQL username (often `root`)
   - `YOUR_PASSWORD` = the MySQL password you set in Step 1
   - `localhost` = your MySQL host (use `127.0.0.1` if localhost fails)
   - `3306` = MySQL port (default)
   - `flowlo` = the database you created in Step 2
4. Save the file.
5. **Important:** `.env` is usually in `.gitignore`. Do not commit it or share it.

---

## Step 4: Install dependencies

1. Open a terminal in the **project root** (same folder as `package.json`).
2. Run:
   ```bash
   npm install
   ```
3. Wait until it finishes. If `prisma generate` runs at the end and completes without errors, you’re good.

---

## Step 5: Create the tables (first migration)

1. In the **same** project root, run:
   ```bash
   npx prisma migrate dev --name init
   ```
2. If it asks to create a new migration, type `y` and Enter.
3. You should see something like “Migration applied” and “Generated Prisma Client”.
4. In MySQL Workbench, refresh the **Schemas** panel (right-click `flowlo` → Refresh). You should see tables: `User`, `Project`, `Task`, and `_prisma_migrations`.

Do **not** run `prisma migrate dev` again unless you change `prisma/schema.prisma` and want to add a new migration.

---

## Step 6: Run the app

1. In the project root, run:
   ```bash
   npm run dev
   ```
2. Open the app in the browser (e.g. http://localhost:3000).
3. Click **Sign In** → **Sign Up**, create an account (name, email, password).
4. After sign up you should be redirected to the dashboard. That means the app is using the database.

---

## Quick checklist

- [ ] MySQL installed and running
- [ ] Database `flowlo` created in Workbench (Step 2)
- [ ] `.env` file in project root with correct `DATABASE_URL` (Step 3)
- [ ] `npm install` done (Step 4)
- [ ] `npx prisma migrate dev --name init` run once (Step 5)
- [ ] `npm run dev` and test sign up / sign in (Step 6)

---

## If something goes wrong

**“Can’t connect to MySQL”**

- Check that MySQL is running (e.g. Windows Services, or MySQL Workbench connection).
- In `.env`, try `127.0.0.1` instead of `localhost`.
- Check username, password, and that the database `flowlo` exists.

**“Prisma schema validation” or “datasource url”**

- Make sure you did **not** add `url = env("DATABASE_URL")` back inside `prisma/schema.prisma`. The URL belongs only in `prisma.config.ts` and `.env`.

**“Migration failed”**

- In Workbench, confirm the database `flowlo` exists.
- Make sure no other program is blocking the tables (e.g. only one app using the DB at a time during migrate).

**App works but “no projects” on dashboard**

- That’s normal at first. Create a project with **New Project** on the dashboard. Data is now stored in MySQL.

---

## Summary

1. Create database `flowlo` in Workbench.  
2. Put `DATABASE_URL` in `.env` in the project root.  
3. Run `npm install`, then `npx prisma migrate dev --name init` once.  
4. Run `npm run dev` and use the app.  

You do not need to put any schema files inside a Workbench folder; everything stays in your project and Prisma creates the tables for you.
