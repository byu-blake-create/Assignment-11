using bookstore.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bookstore.API.Controllers;

[Route("[controller]")]
[ApiController]
public class BooksController : ControllerBase
{
    private readonly BookstoreContext _bookstoreContext;

    public BooksController(BookstoreContext temp) => _bookstoreContext = temp;

    [HttpGet]
    [HttpGet("AllBooks")]
    public async Task<IActionResult> GetBooks(int pageSize = 5, int pageNum = 1, string sort = "title_asc")
    {
        if (pageSize < 1)
        {
            pageSize = 5;
        }

        if (pageNum < 1)
        {
            pageNum = 1;
        }

        var booksQuery = _bookstoreContext.Books.AsQueryable();

        booksQuery = sort.ToLower() switch
        {
            "title_desc" => booksQuery.OrderByDescending(book => book.Title),
            _ => booksQuery.OrderBy(book => book.Title),
        };

        var books = await booksQuery
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var totalNumBooks = await _bookstoreContext.Books.CountAsync();

        var responseObject = new
        {
            Books = books,
            TotalNumBooks = totalNumBooks,
        };

        return Ok(responseObject);
    }
}
