using Microsoft.Extensions.Hosting;
using ProductAndSalesDisplay.Models;
using System.Text.Json;

namespace ProductAndSalesDisplay.Services
{
    public class ProductSaleFetchService : IProductSaleFetchService
    {
        private readonly HttpClient _httpClient;
        private readonly string _singularApiBaseUrl = "https://singularsystems-tech-assessment-sales-api2.azurewebsites.net/";

        public ProductSaleFetchService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<ProductSaleList> GetFormattedData()
        {
            try
            {
                var response = await _httpClient.GetAsync(_singularApiBaseUrl + "product-sales");
                response.EnsureSuccessStatusCode();
                var jsonString = await response.Content.ReadAsStringAsync();
                var sales = JsonSerializer.Deserialize<List<ProductSale>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }) ?? new List<ProductSale>();
                return new ProductSaleList
                {
                    Data = sales,
                    Message = "Success"
                };
            }
            catch (HttpRequestException)
            {
                return new ProductSaleList
                {
                    Data = new List<ProductSale>(),
                    Message = "Error fetching data from the API."
                };
            }
            catch (Exception)
            {
                return new ProductSaleList
                {
                    Data = new List<ProductSale>(),
                    Message = "An unexpected error occurred."
                };
            }
        }
    }
}