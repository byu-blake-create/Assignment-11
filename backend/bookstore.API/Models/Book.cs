namespace bookstore.API.Models;

// Use this model to represent each book coming from the database.
public class Book
{
    public int BookID { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Author { get; set; } = string.Empty;

    public string Publisher { get; set; } = string.Empty;

    public string ISBN { get; set; } = string.Empty;

    public string Classification { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public int PageCount { get; set; }

    public double Price { get; set; }
}
