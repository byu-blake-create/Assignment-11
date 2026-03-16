using bookstore.API.Models;
using Microsoft.EntityFrameworkCore;

namespace bookstore.API.Data;

public class BookstoreContext : DbContext
{
    // Use the database settings you registered in Program.cs.
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options)
    {
    }

    // Make the Books table available to the rest of the API.
    public DbSet<Book> Books => Set<Book>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Match this context to the existing Books table in the provided database.
        modelBuilder.Entity<Book>(entity =>
        {
            entity.ToTable("Books");
            entity.HasKey(book => book.BookID);

            entity.Property(book => book.Title).IsRequired();
            entity.Property(book => book.Author).IsRequired();
            entity.Property(book => book.Publisher).IsRequired();
            entity.Property(book => book.ISBN).IsRequired();
            entity.Property(book => book.Classification).IsRequired();
            entity.Property(book => book.Category).IsRequired();
            entity.Property(book => book.PageCount).IsRequired();
            entity.Property(book => book.Price).IsRequired();
        });
    }
}
