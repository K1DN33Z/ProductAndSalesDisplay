using System;

namespace ProductAndSalesDisplay.Models
{
    // Single product representation
    public class ProductSale
    {
        public int saleId { get; set; }
        public int productId { get; set; }
        public double salePrice { get; set; }
        public int saleQty { get; set; }
        public string saleDate { get; set; }
    }

    // Collection of products
    public class ProductSaleList
    {
        public List<ProductSale> Data { get; set; } = new();
        public String Message { get; set; } = string.Empty;
    }
}