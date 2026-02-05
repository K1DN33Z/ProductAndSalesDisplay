using ProductAndSalesDisplay.Models;

namespace ProductAndSalesDisplay.Services
{
    public interface IProductSaleFetchService
    {
        Task<ProductSaleList> GetFormattedData(string id);
    }
}
