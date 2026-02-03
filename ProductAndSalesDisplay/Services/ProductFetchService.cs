using Microsoft.Extensions.Hosting;
using ProductAndSalesDisplay.Models;
using System.Text.Json;

namespace ProductAndSalesDisplay.Services
{
    public class ProductFetchService : IProductFetchService
    {
        private readonly HttpClient _httpClient;
        private readonly string _singularApiBaseUrl = "https://singularsystems-tech-assessment-sales-api2.azurewebsites.net/";

        public ProductFetchService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<ProductList> GetFormattedData()
        {
            try
            {
                var response = await _httpClient.GetAsync(_singularApiBaseUrl + "products");
                response.EnsureSuccessStatusCode();

                var jsonString = await response.Content.ReadAsStringAsync();

                var products = JsonSerializer.Deserialize<List<Product>>(jsonString, new JsonSerializerOptions {PropertyNameCaseInsensitive = true}) ?? new List<Product>();

                return new ProductList
                {
                    Data = products,
                    Message = "Success"
                };
            }
            catch (HttpRequestException)
            {
                return new ProductList
                {
                    Data = new List<Product>(),
                    Message = "Error fetching data from the API."
                };
            }
            catch (Exception)
            {
                return new ProductList
                {
                    Data = new List<Product>(),
                    Message = "An unexpected error occurred."
                };
            }
        }

    }
}