using ProductAndSalesDisplay.Models;
using ProductAndSalesDisplay.Services;
using Microsoft.AspNetCore.Mvc;

namespace ProductAndSalesDisplay.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductSaleController : ControllerBase
    {
        private readonly IProductSaleFetchService _productSaleFetchService;

        public ProductSaleController(IProductSaleFetchService productSaleFetchService)
        {
            _productSaleFetchService = productSaleFetchService;
        }

        [HttpGet("product-sales")]
        public async Task<ActionResult<ProductSaleList>> GetProductSales([FromQuery] string id)
        {
            var productSalesList = await _productSaleFetchService.GetFormattedData(id);
            return Ok(productSalesList);
        }
    }
}