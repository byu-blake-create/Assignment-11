using bookstore.API.Data;
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

    [HttpGet]
    [HttpGet("AllBooks")]
    public async Task<IActionResult> GetBooks(int pageSize = 5, int pageNum = 1, string sort = "title_asc")
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
        var booksQuery = _bookstoreContext.Books.AsQueryable();

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

        // Get the full number of books so the frontend can build pagination.
        var totalNumBooks = await _bookstoreContext.Books.CountAsync();

        // Send back both the books and the total count for the UI.
        var responseObject = new
        {
            Books = books,
            TotalNumBooks = totalNumBooks,
        };

        return Ok(responseObject);
    }
}
