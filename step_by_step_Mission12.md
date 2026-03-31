# IS 413 Mission #13 - Step-by-Step Guide (Using Your Current Setup)

## Objective
Continue your Bookstore app from Mission #12 and build Phase #6.

Your finished app should:
- Let an admin add new books to the database
- Let an admin edit existing books
- Let an admin delete books
- Keep the existing bookstore features from Mission #12 working
- Deploy the backend and frontend to Azure
- Support direct navigation to React routes like `/adminbooks` after deployment

## What to Turn In
- Your deployed website link in Learning Suite
- If deployment does not happen, submit your GitHub repository link instead

Important:
- Do not overwrite or rework your older grading branches
- Keep `Assignment_12` untouched
- Do all Mission #13 work in `Assignment_13`

## Quick Orientation
This project already has the structure you need:

```text
Assignment 11/
  backend/
    bookstore.API/
  frontend/
```

Use this rule if you are not sure where to work:
- Backend API work happens in `backend/bookstore.API`
- React pages and forms happen in `frontend/src`
- React route hosting fixes happen in `frontend/public`

At a high level, the assignment is:
1. Keep your Mission #12 app working
2. Add backend endpoints for creating, editing, and deleting books
3. Add a React admin page for book management
4. Add the `routes.json` file for deployed React routing
5. Deploy the API and frontend to Azure

---

## Step 1: Start from your new Mission #13 branch
You already created `Assignment_13` from `Assignment_12`.

That is the correct setup because:
- `main` can stay unchanged for older grading needs
- `Assignment_12` stays frozen for Mission #12 grading
- `Assignment_13` becomes your working branch for this assignment

How to check this step:
- Run `git status`
- Confirm the branch is `Assignment_13`
- Confirm the working tree is clean before you start

## Step 2: Make sure Mission #12 still runs first
Before adding CRUD features, confirm the current app still works.

Your important current files include:
- `backend/bookstore.API/Controllers/BooksController.cs`
- `backend/bookstore.API/Data/BookstoreContext.cs`
- `backend/bookstore.API/Models/Book.cs`
- `frontend/src/App.tsx`
- `frontend/src/pages/BookstorePage.tsx`
- `frontend/src/pages/CartPage.tsx`

How to check this step:
- Run the backend and frontend locally
- Confirm books still load
- Confirm category filtering still works
- Confirm the cart still works

Do this first so that if something breaks later, you know it came from Mission #13 changes.

## Step 3: Review the current backend books setup
Right now your API already supports:
- Getting books
- Filtering by category
- Pagination
- Sorting

You now need to add CRUD support for admin work.

The main backend file to update is:
- `backend/bookstore.API/Controllers/BooksController.cs`

Your `Book` model already exists, so Mission #13 is mainly about adding new endpoints and wiring the frontend to them.

How to check this step:
- Open `BooksController.cs`
- Confirm you already have `GET` endpoints
- Confirm the `BookstoreContext` is working

## Step 4: Add a POST endpoint to create books
Add a controller action that accepts a new book and saves it to the database.

Typical endpoint:

```text
POST /Books
```

Typical controller flow:
1. Receive a `Book` object from the request body
2. Validate required fields
3. Add the book with `_bookstoreContext.Books.Add(...)`
4. Call `SaveChangesAsync()`
5. Return a success response

Important fields to validate:
- Title
- Author
- Publisher
- ISBN
- Category
- Price

You can use the existing `Book` model if it already represents the table correctly.

How to check this step:
- Send a POST request from Swagger, Postman, or the frontend
- Confirm a new row appears in the database
- Confirm the new book appears in the bookstore list

## Step 5: Add a PUT endpoint to edit books
Add an endpoint that updates an existing book.

Typical endpoint:

```text
PUT /Books/{id}
```

Typical controller flow:
1. Read the `id` from the route
2. Find the existing book in the database
3. If not found, return `NotFound()`
4. Copy updated field values onto the existing entity
5. Save changes
6. Return success

Important:
- Update the tracked entity from the database, not a random disconnected object unless you handle entity state correctly
- Make sure the correct primary key field from your `Book` model is used

How to check this step:
- Edit a title or price for an existing book
- Refresh the page
- Confirm the updated values remain changed

## Step 6: Add a DELETE endpoint to remove books
Add an endpoint that deletes a book by id.

Typical endpoint:

```text
DELETE /Books/{id}
```

Typical controller flow:
1. Find the book by id
2. If not found, return `NotFound()`
3. Remove it with `_bookstoreContext.Books.Remove(...)`
4. Save changes
5. Return success

How to check this step:
- Delete a book
- Confirm it disappears from the admin page
- Confirm it no longer appears in the bookstore list

## Step 7: Decide where your admin UI should live in React
You need a React route for managing books.

A clean choice for this project is:
- Create a page such as `frontend/src/pages/AdminBooksPage.tsx`
- Add a route in `frontend/src/App.tsx`

Recommended route:

```text
/adminbooks
```

That route can show:
- A list or table of books
- A form to add a book
- An edit action
- A delete action

How to check this step:
- You can navigate to `/adminbooks`
- The page renders without breaking the bookstore or cart routes

## Step 8: Build the admin books page
Your admin page should let the user:
- View current books
- Add a new book
- Edit an existing book
- Delete an existing book

A practical layout is:
1. Book list or table at the top
2. Buttons for edit and delete on each row
3. A form section for add/edit

You can either:
- Use one form for both add and edit
- Or use separate add and edit forms

A single reusable form is usually cleaner.

Suggested React responsibilities:
- Load books from the backend
- Store form state with `useState`
- Submit to `POST` when creating
- Submit to `PUT` when editing
- Call `DELETE` for removals
- Refresh the list after each successful change

How to check this step:
- Add works from the UI
- Edit works from the UI
- Delete works from the UI
- Errors do not crash the page

## Step 9: Connect the admin page to the API
Your frontend will need fetch calls for all CRUD actions.

Typical requests:
- `GET` to load books
- `POST` to create
- `PUT` to update
- `DELETE` to remove

Practical advice:
- Keep the base API URL consistent with your current frontend code
- Reuse the same `Book` type shape used elsewhere in the app if possible
- After each successful add, edit, or delete, reload the book list so the page stays in sync

How to check this step:
- Browser dev tools show successful network calls
- The UI updates after each action without a manual refresh

## Step 10: Add the required React route hosting fix
This assignment specifically requires a `routes.json` file in the React `public` folder.

Create this file:

```text
frontend/public/routes.json
```

Put this content inside it:

```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ]
}
```

Why this matters:
- React is a Single Page Application
- If someone types `/adminbooks` directly into the browser after deployment, the host needs to serve `index.html`
- Without this file, direct navigation to React routes may fail

How to check this step:
- After deployment, manually go to `/adminbooks`
- Confirm the admin page loads instead of giving a 404

## Step 11: Test locally before deploying
Do not deploy first and hope it works.

Test these cases locally:
1. The bookstore page still loads
2. The cart page still loads
3. The admin page loads
4. Add book works
5. Edit book works
6. Delete book works
7. No existing Mission #12 feature broke

This assignment is small enough that a careful manual test pass is worth doing before Azure.

## Step 12: Deploy the backend to Azure
Your backend is an ASP.NET Core API, so a common deployment target is Azure App Service.

High-level flow:
1. Publish the API
2. Create or use an Azure App Service for the backend
3. Deploy the backend there
4. Confirm the API URL works publicly

Important deployment detail:
- Make sure the deployed backend can still access the SQLite database file if you are publishing with SQLite

Because SQLite is a file-based database, verify:
- The database file is included in publish output
- The connection string still points to the right relative location

How to check this step:
- Open the deployed API endpoint in a browser
- Confirm the books endpoint returns data

## Step 13: Deploy the frontend to Azure
Your React frontend can be deployed to Azure as a static site.

A common choice is Azure Static Web Apps.

High-level flow:
1. Build the frontend
2. Deploy the built frontend to Azure
3. Point the frontend to your deployed backend URL
4. Confirm routing works with `routes.json`

Important:
- If the frontend still points to localhost, deployed CRUD will fail
- Update any API base URL configuration as needed for production

How to check this step:
- The deployed site loads
- Books display correctly
- Admin CRUD works against the deployed API
- Direct navigation to `/adminbooks` works

## Step 14: Check the rubric directly
Before submitting, verify each rubric item one by one.

### App Compiles and Runs Without Error
- Backend starts without crashing
- Frontend starts without crashing
- Deployed site loads without runtime failure

### Ability to Add Books
- A new book can be created from the admin UI
- The record is actually saved in the database

### Ability to Edit Books
- Existing books can be updated
- The updated values remain after refresh

### Ability to Delete Books
- Existing books can be removed
- Deleted books no longer appear in the app

### App Deployed on Azure
- Backend is deployed
- Frontend is deployed
- The deployed app functions correctly

### Code Is Clean
- Variable names are clear
- Extra dead code is removed
- Comments are used where they help
- Spacing and layout are readable

## Step 15: Submit
Submit:
- Your deployed website URL through Learning Suite

If deployment does not happen, submit:
- Your GitHub repository link

Before submitting:
- Push `Assignment_13`
- Double-check the deployed site one last time
- Test `/adminbooks` directly in the browser

## Recommended Build Order
If you want the shortest path through the assignment, do it in this order:

1. Add backend `POST`, `PUT`, and `DELETE`
2. Create the React admin route and page
3. Connect add/edit/delete from the page to the API
4. Add `frontend/public/routes.json`
5. Test locally
6. Deploy backend
7. Deploy frontend
8. Test the deployed site and `/adminbooks`

## Final Reminder
Mission #13 is not asking you to rebuild the bookstore. It is asking you to extend the Mission #12 app with admin CRUD and Azure deployment.

Keep the work focused on:
- Add
- Edit
- Delete
- Deploy
- Route support for `/adminbooks`
