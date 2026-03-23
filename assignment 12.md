# IS 413 Mission #12 - Step-by-Step Guide (Using Your Current Setup)

## Objective
Continue your Bookstore project from Mission #11 using the same setup:
- `backend/bookstore.API` for the ASP.NET Core API
- `frontend` for the React app

The finished app should:
- Let the user filter books by category
- Update page numbers based on the selected category
- Let the user add books to a shopping cart
- Keep the cart for the duration of the session while the user navigates
- Show quantity, price, subtotal, and total in the cart
- Let the user continue shopping and return to the page they left
- Show a cart summary on the main book list page
- Use the Bootstrap Grid for layout
- Include two Bootstrap features not covered in class videos

## What to Turn In
- A public GitHub repository link containing:
  - Your backend API in `backend/bookstore.API`
  - Your React frontend in `frontend`
  - All required Mission #12 features
- A Learning Suite comment that identifies the two Bootstrap features you added and where to find them

Important:
- If you do not include the Learning Suite comment about the Bootstrap features, you get no credit for that rubric item.

## Quick Orientation
You are continuing the same app, not starting over.

Use this rule if you are not sure where to work:
- Backend work happens in `backend/bookstore.API`
- Frontend work happens in `frontend`
- Cart UI and book list UI belong in the React app

At a high level, the assignment is:
1. Add category filtering
2. Make pagination respond to the selected category
3. Add a shopping cart that persists for the session
4. Add a cart page and cart summary
5. Update the layout with Bootstrap Grid and two additional Bootstrap features

---

## Step 1: Start from your finished Mission #11 project
Mission #12 builds directly on top of Mission #11.

You should already have:
- A working backend API
- A React frontend that lists books
- Pagination
- Bootstrap installed

How to check this step:
- The backend runs without errors
- The frontend runs without errors
- The book list still loads correctly before you start adding new features

## Step 2: Identify the category field in your data
Your book records should already include a category-like field, often named something like:
- `Category`
- `Classification`

You need that field for filtering.

How to check this step:
- Open your `Book` model
- Confirm the category/classification field exists
- Confirm the database rows actually contain category values like `Biography` or `Self-Help`

## Step 3: Update the backend books endpoint to support category filtering
Modify your books endpoint so it can accept a category parameter.

A good target is:

```text
GET /api/books?page=1&pageSize=5&sort=title_asc&category=Biography
```

Recommended controller flow:
1. Start with `context.Books`
2. If a category is selected and it is not something like `All`, apply a `Where(...)` filter
3. Count the filtered results
4. Apply sorting
5. Apply pagination
6. Return the filtered books plus the paging metadata

Important:
- Count the books after filtering, not before
- That is what makes the page numbers adjust correctly

How to check this step:
- Calling the endpoint with no category returns all books
- Calling the endpoint with a category returns only matching books
- `totalCount` changes when the category changes

## Step 4: Add a way to load the list of categories
Your frontend needs category options for the filter UI.

You can do this in either of these ways:
- Create a dedicated endpoint like `GET /api/books/categories`
- Or derive unique categories from the books data if your current design makes that simpler

The cleaner option is usually a separate backend endpoint that returns distinct categories.

Example result:

```json
["All", "Biography", "Fiction", "Self-Help"]
```

How to check this step:
- The frontend can load the categories without hardcoding every value
- The category list does not contain duplicates

## Step 5: Add category filter state in React
In your book list component, add state for the selected category.

Suggested state:
- Current page
- Page size
- Sort
- Selected category
- Total count
- Books

When the category changes:
- Reset the page back to `1`
- Refetch the book list using the selected category

Why reset the page:
- If the user is on page 4 and changes to a small category, page 4 may no longer exist

How to check this step:
- The category UI renders
- Changing the category refreshes the books
- The current page resets to `1`

## Step 6: Make pagination adjust to the filtered results
This is a direct rubric item.

Your page count should be based on the filtered `totalCount`:

```ts
const totalPages = Math.ceil(totalCount / pageSize)
```

If category filtering is working correctly on the backend, pagination should update automatically.

How to check this step:
- Choose a category with fewer books
- Confirm the number of page buttons gets smaller if needed
- Confirm you cannot navigate to invalid pages for that category

## Step 7: Create cart models and cart logic
You need a shopping cart that keeps track of:
- Book
- Quantity
- Line subtotal
- Cart total

In React, a common structure is:
- One cart item type
- One cart state array
- Functions such as:
  - `addToCart`
  - `removeFromCart`
  - `updateQuantity`
  - `clearCart`

If the same book is added again:
- Increase the quantity
- Do not create duplicate separate line items for the same book unless your design intentionally merges them later

How to check this step:
- Adding the same book twice increases quantity
- Line subtotal changes correctly
- Total changes correctly

## Step 8: Persist the cart for the session
The instructions say the cart should persist for the duration of the session as the user navigates around.

A practical React approach is:
- Store the cart in a shared place such as Context
- Save the cart to `sessionStorage`
- Reload the cart from `sessionStorage` when the app starts

Why `sessionStorage` is a good fit:
- It lasts for the browser session
- It survives page navigation and refreshes in the same session
- It matches the assignment wording well

How to check this step:
- Add items to the cart
- Navigate to another page and back
- Refresh the page
- Confirm the cart is still there during the same session

## Step 9: Add “Add to Cart” buttons on the book list
Each displayed book should have an add-to-cart action.

Typical UI pattern:
- Show book details
- Show price
- Add an `Add to Cart` button

When clicked:
- Add the selected book to the cart
- Update the cart summary
- Keep enough information to let the user continue shopping from the same place

How to check this step:
- Clicking the button updates the cart immediately
- Quantity increments correctly for repeated adds

## Step 10: Build a cart page
Create a dedicated cart page in the React app.

The cart page should show:
- Book title
- Price
- Quantity
- Subtotal for each line item
- Grand total

This page is a direct rubric item.

Expected behavior:
- If the same item is added multiple times, quantity updates correctly
- Totals should reflect the current quantities

How to check this step:
- The cart page renders without errors
- Each line item shows quantity and subtotal
- The final total is correct

## Step 11: Add “Continue Shopping” and return the user to where they left off
The instructions specifically say the user should be able to continue shopping and return to the page where they left off.

A practical approach:
- Preserve the current page, page size, sort, and category in the URL query string or navigation state
- When the user goes to the cart and clicks `Continue Shopping`, send them back to that saved location

Example:
- If the user was on page 3 of `Biography`, send them back to that same filtered page

How to check this step:
- Go to a specific page and category
- Add an item
- Open the cart
- Click `Continue Shopping`
- Confirm you return to the same page/filter state

## Step 12: Add a cart summary to the main book list page
The home page needs a cart summary that shows:
- Quantity
- Price or total amount

This should be visible while browsing books.

Simple example:
- `Cart: 3 items | Total: $45.97`

How to check this step:
- Add an item from the home page
- Confirm the summary updates
- Confirm both quantity and price/total are shown

## Step 13: Arrange the page using the Bootstrap Grid
This is a direct rubric requirement.

Use Bootstrap layout classes such as:
- `container`
- `row`
- `col`
- `col-md-8`
- `col-md-4`

A clean layout would be:
- Main book list in one column
- Category filter and/or cart summary in another column

How to check this step:
- The layout uses Bootstrap Grid classes
- The page structure is clearly organized
- The app still looks correct at normal browser sizes

## Step 14: Add two Bootstrap features not covered in the videos
You need two Bootstrap things beyond the grid.

Keep this simple. Good options include:
- `badge`
- `card`
- `offcanvas`
- `accordion`
- `toast`
- `modal`
- `alert`
- `breadcrumb`
- `dropdown`

Pick two that fit naturally into your app.

Example ideas:
- Use a `badge` in the cart summary for item count
- Use a `card` layout for each book or for the cart summary

Important:
- In Learning Suite, leave a comment saying exactly which two Bootstrap features you used and where they appear in the app

How to check this step:
- Two clearly identifiable Bootstrap features are present
- You know exactly what comment you will leave in Learning Suite

## Step 15: Clean up the code
The rubric includes code cleanliness.

Before submitting:
- Remove dead starter code
- Use readable names
- Keep components organized
- Avoid repeated logic where possible
- Add small comments only where they help explain something non-obvious

How to check this step:
- Files are easy to navigate
- Components and types have clear names
- There is no obvious leftover sample code

## Step 16: Run and verify locally
Run the backend from `backend/bookstore.API`:

```bash
dotnet run
```

Run the frontend from `frontend`:

```bash
npm run dev
```

Verify all of the following:
- The app compiles and runs without errors
- Category filtering works
- Page numbers change with filtering
- Books can be added to the cart
- Cart persists during the session
- The cart page shows quantity, subtotal, and total correctly
- The home page cart summary shows quantity and price/total
- Bootstrap Grid is used
- Two additional Bootstrap features are present

If something is broken, check in this order:
1. Is the backend running?
2. Does the books API return filtered results correctly?
3. Is the frontend sending the category/page values correctly?
4. Is cart state being saved and loaded properly?
5. Are there browser console errors?

## Step 17: Push to GitHub and submit
From the project root:

```bash
git add .
git commit -m "Mission 12 bookstore app with category filtering and cart"
git push
```

Before submitting:
- Confirm the repo is public
- Confirm the latest code is pushed
- Submit the GitHub link in Learning Suite
- Add the Learning Suite comment that names the two Bootstrap features and where they are used

Example Learning Suite comment:

```text
I used Bootstrap cards on the main book list and Bootstrap badges in the cart summary at the top of the home page.
```

---

## Rubric Checklist (Final Self-Check)

### 1) App Compiles and Runs (10)
- [ ] Program compiles and runs without errors
- [ ] Pages load correctly

### 2) App Allows User to Filter Books (20)
- [ ] User can filter books by category
- [ ] The filter behaves correctly

### 3) Page Numbers Change with Filtering (5)
- [ ] Pagination changes based on the selected category

### 4) App Has Cart that Persists (25)
- [ ] User can add books to cart
- [ ] Cart persists as the user navigates during the session
- [ ] Quantity and totals update correctly

### 5) Cart Page (10)
- [ ] Cart page exists
- [ ] Each line item shows quantity
- [ ] Each line item shows subtotal
- [ ] Cart shows a correct final total

### 6) Cart Summary on Home Page (10)
- [ ] Home page has a cart summary
- [ ] Summary shows quantity
- [ ] Summary shows price/total

### 7) Bootstrap (10)
- [ ] Bootstrap Grid is used for layout
- [ ] Two additional Bootstrap features are included
- [ ] Learning Suite comment identifies both Bootstrap features and where they are used

### 8) Code is Clean (10)
- [ ] Code is readable
- [ ] Naming is appropriate
- [ ] Spacing and organization are clean
- [ ] Comments are used appropriately
