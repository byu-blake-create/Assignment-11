# IS 413 Mission #11 - Step-by-Step Guide (Using Your Current Setup)

## Objective
Build an online bookstore app using your current setup:
- `backend/bookstore.API` for the ASP.NET Core API
- `frontend` for the React app

The finished app should:
- Connect to the provided pre-populated database
- List books
- Support pagination with a default of 5 books per page
- Let users change page size
- Let users sort by Book Title
- Use Bootstrap styling

## What to Turn In
- A GitHub repository link containing:
  - Your backend API in `backend/bookstore.API`
  - Your React frontend in `frontend`
  - A working database connection
  - All required rubric features

---

## Step 1: Start from the setup you already made
You already have the basic project structure:

```text
Assignment 11/
  backend/
    bookstore.API/
  frontend/
```

That means you do **not** need to create a new solution, a new API project, or a new Vite app. From this point on, just build the assignment features into those two folders.

## Step 2: Add the required backend packages
Open a terminal in `backend/bookstore.API` and add Entity Framework packages:

```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Tools
```

If your instructor-provided database is SQL Server instead of SQLite, replace the SQLite package with:

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
```

## Step 3: Put the provided database in the backend project
1. Download the database from the assignment instructions.
2. Place it somewhere inside `backend/bookstore.API`.
3. A clean option is something like:

```text
backend/bookstore.API/Data/Bookstore.sqlite
```

Use the real filename your instructor gave you.

## Step 4: Create models that match the database
Inside `backend/bookstore.API`, create model classes that match the database table exactly.

Expected book fields include:
- `Title`
- `Author`
- `Publisher`
- `ISBN`
- `Classification` or `Category`
- `PageCount` or `NumPages`
- `Price`

Also include the primary key from the database, such as `BookId` or `Id`.

Important:
- Match the database column names and data types as closely as possible.
- Make required fields required in your model.
- Put these classes in a folder such as `Models/`.

## Step 5: Create the DbContext and connection string
In `backend/bookstore.API/appsettings.json`, add a connection string. If you used a SQLite file in `Data/Bookstore.sqlite`, it would look like this:

```json
"ConnectionStrings": {
  "BookstoreConnection": "Data Source=Data/Bookstore.sqlite"
}
```

Create a `DbContext` class, for example `BookstoreContext`, and add a `DbSet<Book>`.

Then update `backend/bookstore.API/Program.cs` to register the context:

```csharp
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));
```

Your `Program.cs` already has controller setup, so you are just adding the DbContext registration to the existing file.

## Step 6: Build the books API endpoint
Create an endpoint in `backend/bookstore.API` that supports listing, pagination, and sorting.

A good target is:

```text
GET /api/books?page=1&pageSize=5&sort=title_asc
```

The response should include:
- `books`
- `totalCount`
- `page`
- `pageSize`

Example response shape:

```json
{
  "books": [],
  "totalCount": 42,
  "page": 1,
  "pageSize": 5
}
```

Implementation checklist:
1. Start from `context.Books`
2. Apply sorting by title
3. Apply `Skip((page - 1) * pageSize)`
4. Apply `Take(pageSize)`
5. Return both the current page of books and the total count

## Step 7: Add Bootstrap to the React app
Open a terminal in `frontend` and install Bootstrap:

```bash
npm install bootstrap
```

Then update `frontend/src/main.tsx`:

```ts
import 'bootstrap/dist/css/bootstrap.min.css'
```

Keep your existing imports there too.

## Step 8: Create a book list component in React
Inside `frontend/src`, create a component such as `BookList.tsx`.

That component should:
1. Fetch data from your backend API
2. Display the required book fields
3. Use Bootstrap styling
4. Track:
   - `page`
   - `pageSize`
   - `sort`
   - `totalCount`

If your backend runs on a different port than the React app, make sure your fetch URL points to the backend correctly.

## Step 9: Add dynamic pagination
In React, compute the number of pages from the API result:

```ts
const totalPages = Math.ceil(totalCount / pageSize)
```

Generate page buttons dynamically:

```ts
Array.from({ length: totalPages }, (_, i) => i + 1)
```

Rubric requirements:
- Default to 5 books per page
- Let the user change page size
- Reset to page 1 when page size changes
- Do not hardcode page buttons

## Step 10: Add title sorting
Add a dropdown or buttons for:
- `Title (A-Z)`
- `Title (Z-A)`

Send the selected sort value to the API and refresh the displayed books.

## Step 11: Render the component in your existing React app
Update `frontend/src/App.tsx` so it renders:
- A page heading
- Your `BookList` component

## Step 12: Clean up the starter code
You started from the default templates, so make sure to remove or replace starter content that is no longer relevant.

Examples:
- Remove the default Vite React sample UI from `frontend/src/App.tsx`
- Remove unused CSS that came with the starter app
- Replace the sample weather controller in `backend/bookstore.API/Controllers/WeatherForecastController.cs` if you no longer need it

Keep only the code needed for the bookstore assignment.

## Step 13: Run and verify locally
Run the backend from `backend/bookstore.API`:

```bash
dotnet run
```

Run the frontend from `frontend`:

```bash
npm run dev
```

Verify all of the following:
- Backend runs without errors
- Frontend runs without errors
- Books load from the database
- Pagination works dynamically
- Page size selector works
- Title sorting works
- Bootstrap styling is visible

## Step 14: Push to GitHub and submit
From the project root:

```bash
git add .
git commit -m "Mission 11 bookstore app with pagination and title sorting"
git push
```

Submit your GitHub repository link in Learning Suite.

---

## Rubric Checklist (Final Self-Check)

### 1) Program Runs Without Error (5)
- [ ] Backend builds and runs
- [ ] Frontend builds and runs
- [ ] No console or API errors during normal use

### 2) Models Match Database (5)
- [ ] Model properties match the DB columns and types
- [ ] Required fields are enforced

### 3) App Lists Books (10)
- [ ] Books from the provided DB are displayed
- [ ] Multiple records load correctly

### 4) Dynamic Pagination (15)
- [ ] Default is 5 books per page
- [ ] Page links or buttons are generated from `totalCount`
- [ ] No hardcoded page numbers
- [ ] User can change results per page

### 5) Sort by Book Title (5)
- [ ] User can select title sort
- [ ] Sorting works correctly in both directions

### 6) Bootstrap Styling (5)
- [ ] Bootstrap classes are used
- [ ] UI is readable and consistent

### 7) Code is Clean (5)
- [ ] Readable naming and structure
- [ ] Minimal duplication
- [ ] No dead code or unnecessary complexity
