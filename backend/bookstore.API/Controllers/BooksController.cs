using bookstore.API.Data;
using bookstore.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bookstore.API.Controllers;

[Route("[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    // Use the database context here so this controller can get bookstore data.
    private readonly BookstoreContext _bookstoreContext;

    public BooksController(BookstoreContext temp) => _bookstoreContext = temp;

    private static Dictionary<string, string[]> ValidateBook(Book book)
    {
        var errors = new Dictionary<string, string[]>();

        if (string.IsNullOrWhiteSpace(book.Title))
        {
            errors["Title"] = ["Title is required."];
        }

        if (string.IsNullOrWhiteSpace(book.Author))
        {
            errors["Author"] = ["Author is required."];
        }

        if (string.IsNullOrWhiteSpace(book.Publisher))
        {
            errors["Publisher"] = ["Publisher is required."];
        }

        if (string.IsNullOrWhiteSpace(book.ISBN))
        {
            errors["ISBN"] = ["ISBN is required."];
        }

        if (string.IsNullOrWhiteSpace(book.Classification))
        {
            errors["Classification"] = ["Classification is required."];
        }

        if (string.IsNullOrWhiteSpace(book.Category))
        {
            errors["Category"] = ["Category is required."];
        }

        if (book.PageCount < 1)
        {
            errors["PageCount"] = ["Page count must be greater than 0."];
        }

        if (book.Price <= 0)
        {
            errors["Price"] = ["Price must be greater than 0."];
        }

        return errors;
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetCategories()
    {
        // Return a clean category list so the frontend can build its filter UI.
        var categories = await _bookstoreContext.Books
            .AsNoTracking()
            .Select(book => book.Category)
            .Where(category => !string.IsNullOrWhiteSpace(category))
            .Distinct()
            .OrderBy(category => category)
            .ToListAsync();

        categories.Insert(0, "All");

        return Ok(categories);
    }

    [HttpGet]
    [HttpGet("AllBooks")]
    public async Task<IActionResult> GetBooks(
        int pageSize = 5,
        int pageNum = 1,
        string sort = "title_asc",
        string? category = null
    )
    {
        // Keep paging values safe so the request still works if the user passes bad numbers.
        if (pageSize < 1)
        {
            pageSize = 5;
        }

        if (pageNum < 1)
        {
            pageNum = 1;
        }

        // Start with all books, then shape the results for the current page.
        var booksQuery = _bookstoreContext.Books.AsNoTracking().AsQueryable();

        // Filter by category when the user chooses a specific category value.
        var selectedCategory = category?.Trim();

        if (!string.IsNullOrWhiteSpace(selectedCategory)
            && !string.Equals(selectedCategory, "All", StringComparison.OrdinalIgnoreCase))
        {
            booksQuery = booksQuery.Where(book => book.Category == selectedCategory);
        }

        // Count after filtering so pagination reflects the selected category.
        var totalNumBooks = await booksQuery.CountAsync();

        // Apply the title sort choice the user selected on the frontend.
        booksQuery = sort.ToLower() switch
        {
            "title_desc" => booksQuery.OrderByDescending(book => book.Title),
            _ => booksQuery.OrderBy(book => book.Title),
        };

        // Pull just the records needed for the current page.
        var books = await booksQuery
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Send back both the books and the total count for the UI.
        var responseObject = new
        {
            Books = books,
            TotalNumBooks = totalNumBooks,
        };

        return Ok(responseObject);
    }

    [HttpPost]
    public async Task<IActionResult> CreateBook([FromBody] Book book)
    {
        var validationErrors = ValidateBook(book);

        if (validationErrors.Count > 0)
        {
            return BadRequest(new { Errors = validationErrors });
        }

        // Let SQLite assign the next primary key for newly created books.
        book.BookID = 0;

        _bookstoreContext.Books.Add(book);
        await _bookstoreContext.SaveChangesAsync();

        return Created($"/Books/{book.BookID}", book);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] Book updatedBook)
    {
        if (id != updatedBook.BookID)
        {
            return BadRequest("Route id must match the book id in the request body.");
        }

        var validationErrors = ValidateBook(updatedBook);

        if (validationErrors.Count > 0)
        {
            return BadRequest(new { Errors = validationErrors });
        }

        var existingBook = await _bookstoreContext.Books.FindAsync(id);

        if (existingBook is null)
        {
            return NotFound();
        }

        // Update the tracked entity so EF Core persists only the intended row.
        existingBook.Title = updatedBook.Title;
        existingBook.Author = updatedBook.Author;
        existingBook.Publisher = updatedBook.Publisher;
        existingBook.ISBN = updatedBook.ISBN;
        existingBook.Classification = updatedBook.Classification;
        existingBook.Category = updatedBook.Category;
        existingBook.PageCount = updatedBook.PageCount;
        existingBook.Price = updatedBook.Price;

        await _bookstoreContext.SaveChangesAsync();

        return Ok(existingBook);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var existingBook = await _bookstoreContext.Books.FindAsync(id);

        if (existingBook is null)
        {
            return NotFound();
        }

        _bookstoreContext.Books.Remove(existingBook);
        await _bookstoreContext.SaveChangesAsync();

        return NoContent();
    }
}
