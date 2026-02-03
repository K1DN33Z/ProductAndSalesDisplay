namespace ProductAndSalesDisplay.Models
{
    // Single product representation
    public class Product
    {
        public int id { get; set; }
        public string description { get; set; }
        public decimal salesPrice { get; set; }
        public string category { get; set; }
        public string image { get; set; }
    }

    // Collection of products
    public class ProductList
    {
        public List<Product> Data { get; set; } = new();
        public String Message { get; set; } = string.Empty;
    }
}