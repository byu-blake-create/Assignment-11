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

## Quick Orientation
Use this rule if you are not sure where to work:
- Backend work happens in `backend/bookstore.API`
- Frontend work happens in `frontend`
- The database file belongs in `backend/bookstore.API/Data`

At a high level, the assignment is:
1. Connect the backend to the database
2. Build an endpoint that returns books
3. Make React fetch and display those books
4. Add pagination, page size, and sorting
5. Clean up the project and submit

---

## Step 1: Start from the setup you already made
You already have the basic project structure:

```text
Assignment 11/
  backend/
    bookstore.API/
  frontend/
```

That means you do **not** need to create a new solution, a new API project, or a new Vite app. You can keep building inside the folders you already made.

How to check this step:
- You see `backend/bookstore.API/bookstore.API.csproj`
- You see `frontend/package.json`
- Both folders already open and run as separate projects

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

What these packages do:
- `Microsoft.EntityFrameworkCore` gives you EF Core
- `Microsoft.EntityFrameworkCore.Sqlite` lets EF talk to SQLite
- `Design` and `Tools` support EF commands and database-related workflow

How to check this step:
- Open `backend/bookstore.API/bookstore.API.csproj`
- Confirm the EF package references are there

## Step 3: Put the provided database in the backend project
1. Download the database from the assignment instructions.
2. Put it somewhere inside `backend/bookstore.API`.
3. A clean location is:

```text
backend/bookstore.API/Data/Bookstore.sqlite
```

Use the real filename your instructor gave you if it is different.

Why this location is helpful:
- The API can reference it with a simple relative path
- The DB stays with the backend project
- The connection string stays easy to read

How to check this step:
- The file exists in `backend/bookstore.API/Data`
- The file is not empty
- If you inspect the database, you should see a `Books` table

## Step 4: Create models that match the database
Inside `backend/bookstore.API`, create model classes that match the database table exactly.

In your project, this usually means creating a file like:

```text
backend/bookstore.API/Models/Book.cs
```

Expected book fields include:
- `Title`
- `Author`
- `Publisher`
- `ISBN`
- `Classification` or `Category`
- `PageCount` or `NumPages`
- `Price`

Also include the primary key from the database, such as `BookID` or `Id`.

Important:
- Match database column names as closely as possible
- Match the database data types as closely as possible
- Keep required fields required in your model

What this step is doing:
- One `Book` object represents one row in the `Books` table
- EF Core uses this class to map database data into C# objects

How to check this step:
- You have a `Book.cs` file in `Models`
- The class contains all required properties from the `Books` table
- Property names line up with the DB schema

## Step 5: Create the DbContext and connection string
In `backend/bookstore.API/appsettings.json`, add a connection string. If your file is in `Data/Bookstore.sqlite`, it should look like this:

```json
"ConnectionStrings": {
  "BookstoreConnection": "Data Source=Data/Bookstore.sqlite"
}
```

Create a `DbContext` class, for example:

```text
backend/bookstore.API/Data/BookstoreContext.cs
```

That context should include a `DbSet<Book>` for the `Books` table.

Then update `backend/bookstore.API/Program.cs` to register the context:

```csharp
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("BookstoreConnection")));
```

What the context does:
- It connects EF Core to your database
- It gives your code access to the `Books` table through `context.Books`
- It becomes the main object your controllers use to query data

How to check this step:
- `appsettings.json` contains `BookstoreConnection`
- `Program.cs` contains `AddDbContext<BookstoreContext>(...)`
- Your context class contains `DbSet<Book> Books`
- `dotnet build` succeeds

## Step 6: Build the books API endpoint
Create an endpoint in `backend/bookstore.API` that supports listing, pagination, and sorting.

A good target is:

```text
GET /api/books?page=1&pageSize=5&sort=title_asc
```

The easiest place to build this is in a controller like:

```text
backend/bookstore.API/Controllers/BooksController.cs
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

Recommended controller flow:
1. Inject `BookstoreContext` into the controller constructor
2. Start with `context.Books`
3. Sort based on the `sort` query value
4. Count the total number of books before paging
5. Apply `Skip((page - 1) * pageSize)`
6. Apply `Take(pageSize)`
7. Return the results and metadata as JSON

Helpful notes:
- Default `page` to `1`
- Default `pageSize` to `5`
- Default `sort` to `title_asc`
- It is okay to return an anonymous object from the controller

How to check this step:
- Run the backend with `dotnet run`
- Test `/api/books?page=1&pageSize=5&sort=title_asc`
- You should get JSON back, not an error page
- The JSON should include both the list and the paging metadata

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

Why this matters:
- You can use Bootstrap classes like `container`, `table`, `btn`, `form-select`, and `pagination`
- You get a cleaner UI faster than writing all the CSS yourself

How to check this step:
- `bootstrap` appears in `frontend/package.json`
- The import is present in `frontend/src/main.tsx`

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

Suggested structure:
- One state variable for the book list
- One state variable for the current page
- One state variable for page size
- One state variable for sort
- One state variable for total count
- One `useEffect` that refetches when page, page size, or sort changes

You will probably also want TypeScript interfaces for:
- One `Book`
- One API response object containing `books`, `totalCount`, `page`, and `pageSize`

How to check this step:
- The component renders without TypeScript errors
- The page loads in the browser
- You can see data in the UI or at least confirm the fetch is working in the browser console

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

What "dynamic" means here:
- If there are 6 books, you should not manually type 2 page buttons
- If there are 100 books, the UI should still create the correct number automatically

How to check this step:
- Click different page buttons and confirm different rows appear
- Change page size and confirm the number of pages updates if needed
- Confirm the page buttons are generated from data, not written by hand

## Step 10: Add title sorting
Add a dropdown or buttons for:
- `Title (A-Z)`
- `Title (Z-A)`

Send the selected sort value to the API and refresh the displayed books.

Simple approach:
- Use a dropdown with values like `title_asc` and `title_desc`
- Store the selected value in React state
- Include that value in the fetch URL

How to check this step:
- Choose A-Z and confirm the titles sort ascending
- Choose Z-A and confirm the titles sort descending
- Changing the sort should refresh the data immediately

## Step 11: Render the component in your existing React app
Update `frontend/src/App.tsx` so it renders:
- A page heading
- Your `BookList` component

At this point, `App.tsx` should stop looking like the default Vite starter app and start looking like your bookstore page.

How to check this step:
- The page shows a bookstore heading
- The page also shows your book list UI
- The default starter content is gone

## Step 12: Clean up the starter code
You started from the default templates, so make sure to remove or replace starter content that is no longer relevant.

Examples:
- Remove the default Vite React sample UI from `frontend/src/App.tsx`
- Remove unused CSS that came with the starter app
- Replace the sample weather controller in `backend/bookstore.API/Controllers/WeatherForecastController.cs` if you no longer need it

Keep only the code needed for the bookstore assignment.

Why this matters:
- The rubric includes code cleanliness
- Extra starter files make your submission look unfinished

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

If something is broken, check in this order:
1. Is the backend running?
2. Does `/api/books` return JSON?
3. Is the frontend calling the correct backend URL?
4. Are there browser console errors?
5. Are there backend terminal errors?

## Step 14: Push to GitHub and submit
From the project root:

```bash
git add .
git commit -m "Mission 11 bookstore app with pagination and title sorting"
git push
```

Before you push, do one last quick review:
- Remove obvious starter code
- Make sure file names are sensible
- Run both backend and frontend one more time
- Click through pagination and sorting once

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
