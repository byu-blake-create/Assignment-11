using bookstore.API.Models;
using Microsoft.EntityFrameworkCore;

namespace bookstore.API.Data;

public class BookstoreContext : DbContext
{
    public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options)
    {
    }

    public DbSet<Book> Books => Set<Book>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
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
