using ProductAndSalesDisplay.Models;
using ProductAndSalesDisplay.Services;
using Microsoft.AspNetCore.Mvc;

namespace ProductAndSalesDisplay.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class ProductController : ControllerBase
    {
        private readonly IProductFetchService _productFetchService;

        public ProductController(IProductFetchService productFetchService)
        {
            _productFetchService = productFetchService;
        }

        [HttpGet("products")]
        public async Task<ActionResult<ProductList>> GetProducts()
        {
            var productList = await _productFetchService.GetFormattedData();
            return Ok(productList);
        }
    }
}