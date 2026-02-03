using ProductAndSalesDisplay.Models;

namespace ProductAndSalesDisplay.Services
{
    public interface IProductFetchService
   {
        Task<ProductList> GetFormattedData();
   }
}