using System.Net;
using System.Text;
using System.Text.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Moq.Protected;
using ProductAndSalesDisplay.Controllers;
using ProductAndSalesDisplay.Models;
using ProductAndSalesDisplay.Services;
using Xunit;

namespace ProductAndSalesDisplay.Tests
{
	public class ProductFetchServiceTests
	{
		private static string CreateFakeProductListJson()
		{
			return """
            [
                {
                    "id": 1,
                    "description": "Test Product 1",
                    "salesPrice": 99.99,
                    "category": "Electronics",
                    "image": "product1.png"
                },
                {
                    "id": 2,
                    "description": "Test Product 2",
                    "salesPrice": 149.99,
                    "category": "Books",
                    "image": "product2.png"
                }
            ]
            """;
		}

		private static HttpClient CreateMockHttpClient(
			HttpStatusCode statusCode,
			string responseContent = "",
			bool throwException = false,
			Exception? exceptionToThrow = null)
		{
			var handlerMock = new Mock<HttpMessageHandler>();

			var setup = handlerMock
				.Protected()
				.Setup<Task<HttpResponseMessage>>(
					"SendAsync",
					ItExpr.IsAny<HttpRequestMessage>(),
					ItExpr.IsAny<CancellationToken>()
				);

			if (throwException)
			{
				setup.ThrowsAsync(exceptionToThrow ?? new HttpRequestException("Network error"));
			}
			else
			{
				setup.ReturnsAsync(new HttpResponseMessage
				{
					StatusCode = statusCode,
					Content = new StringContent(responseContent, Encoding.UTF8, "application/json")
				});
			}

			return new HttpClient(handlerMock.Object)
			{
				BaseAddress = new Uri("https://singularsystems-tech-assessment-sales-api2.azurewebsites.net/")
			};
		}

		[Fact]
		public async Task GetFormattedData_WhenApiReturnsData_ReturnsProductListWithSuccessMessage()
		{
			// Arrange
			var httpClient = CreateMockHttpClient(HttpStatusCode.OK, CreateFakeProductListJson());
			var service = new ProductFetchService(httpClient);

			// Act
			var result = await service.GetFormattedData();

			// Assert
			result.Should().NotBeNull();
			result.Message.Should().Be("Success");
			result.Data.Should().NotBeNull();
			result.Data.Should().HaveCount(2);

			var firstProduct = result.Data.First();
			firstProduct.id.Should().Be(1);
			firstProduct.description.Should().Be("Test Product 1");
			firstProduct.salesPrice.Should().Be(99.99m);
			firstProduct.category.Should().Be("Electronics");
			firstProduct.image.Should().Be("product1.png");
		}

		[Fact]
		public async Task GetFormattedData_WhenApiReturnsEmptyArray_ReturnsEmptyProductList()
		{
			// Arrange
			var httpClient = CreateMockHttpClient(HttpStatusCode.OK, "[]");
			var service = new ProductFetchService(httpClient);

			// Act
			var result = await service.GetFormattedData();

			// Assert
			result.Should().NotBeNull();
			result.Message.Should().Be("Success");
			result.Data.Should().NotBeNull();
			result.Data.Should().BeEmpty();
		}

		[Fact]
		public async Task GetFormattedData_WhenHttpRequestExceptionOccurs_ReturnsErrorMessage()
		{
			// Arrange
			var httpClient = CreateMockHttpClient(
				HttpStatusCode.OK,
				throwException: true,
				exceptionToThrow: new HttpRequestException("Connection failed"));
			var service = new ProductFetchService(httpClient);

			// Act
			var result = await service.GetFormattedData();

			// Assert
			result.Should().NotBeNull();
			result.Message.Should().Be("Error fetching data from the API.");
			result.Data.Should().NotBeNull();
			result.Data.Should().BeEmpty();
		}

		[Fact]
		public async Task GetFormattedData_WhenApiReturns404_ReturnsErrorMessage()
		{
			// Arrange
			var httpClient = CreateMockHttpClient(HttpStatusCode.NotFound, "");
			var service = new ProductFetchService(httpClient);

			// Act
			var result = await service.GetFormattedData();

			// Assert
			result.Should().NotBeNull();
			result.Message.Should().Be("Error fetching data from the API.");
			result.Data.Should().NotBeNull();
			result.Data.Should().BeEmpty();
		}

		[Fact]
		public async Task GetFormattedData_WhenApiReturns500_ReturnsErrorMessage()
		{
			// Arrange
			var httpClient = CreateMockHttpClient(HttpStatusCode.InternalServerError, "");
			var service = new ProductFetchService(httpClient);

			// Act
			var result = await service.GetFormattedData();

			// Assert
			result.Should().NotBeNull();
			result.Message.Should().Be("Error fetching data from the API.");
			result.Data.Should().NotBeNull();
			result.Data.Should().BeEmpty();
		}

		[Fact]
		public async Task GetFormattedData_WhenUnexpectedExceptionOccurs_ReturnsUnexpectedErrorMessage()
		{
			// Arrange
			var httpClient = CreateMockHttpClient(
				HttpStatusCode.OK,
				throwException: true,
				exceptionToThrow: new InvalidOperationException("Unexpected error"));
			var service = new ProductFetchService(httpClient);

			// Act
			var result = await service.GetFormattedData();

			// Assert
			result.Should().NotBeNull();
			result.Message.Should().Be("An unexpected error occurred.");
			result.Data.Should().NotBeNull();
			result.Data.Should().BeEmpty();
		}

		[Fact]
		public async Task GetFormattedData_WhenApiReturnsInvalidJson_ReturnsUnexpectedErrorMessage()
		{
			// Arrange
			var httpClient = CreateMockHttpClient(HttpStatusCode.OK, "{ invalid json }");
			var service = new ProductFetchService(httpClient);

			// Act
			var result = await service.GetFormattedData();

			// Assert
			result.Should().NotBeNull();
			result.Message.Should().Be("An unexpected error occurred.");
			result.Data.Should().NotBeNull();
			result.Data.Should().BeEmpty();
		}

		[Fact]
		public async Task GetFormattedData_CallsCorrectApiEndpoint()
		{
			// Arrange
			HttpRequestMessage? capturedRequest = null;
			var handlerMock = new Mock<HttpMessageHandler>();
			handlerMock
				.Protected()
				.Setup<Task<HttpResponseMessage>>(
					"SendAsync",
					ItExpr.IsAny<HttpRequestMessage>(),
					ItExpr.IsAny<CancellationToken>()
				)
				.ReturnsAsync(new HttpResponseMessage
				{
					StatusCode = HttpStatusCode.OK,
					Content = new StringContent("[]", Encoding.UTF8, "application/json")
				})
				.Callback<HttpRequestMessage, CancellationToken>((request, _) => capturedRequest = request);

			var httpClient = new HttpClient(handlerMock.Object);
			var service = new ProductFetchService(httpClient);

			// Act
			await service.GetFormattedData();

			// Assert
			capturedRequest.Should().NotBeNull();
			capturedRequest!.Method.Should().Be(HttpMethod.Get);
			capturedRequest.RequestUri.Should().NotBeNull();
			capturedRequest.RequestUri!.ToString().Should().Contain("products");
		}
	}

	public class ProductControllerTests
	{
		[Fact]
		public async Task GetProducts_WhenServiceReturnsData_ReturnsOkWithProductList()
		{
			// Arrange
			var expectedProductList = new ProductList
			{
				Data = new List<Product>
				{
					new Product { id = 1, description = "Product 1", salesPrice = 10.99m, category = "Cat1", image = "img1.png" },
					new Product { id = 2, description = "Product 2", salesPrice = 20.99m, category = "Cat2", image = "img2.png" }
				},
				Message = "Success"
			};

			var mockService = new Mock<IProductFetchService>();
			mockService
				.Setup(s => s.GetFormattedData())
				.ReturnsAsync(expectedProductList);

			var controller = new ProductController(mockService.Object);

			// Act
			var result = await controller.GetProducts();

			// Assert
			result.Should().NotBeNull();
			result.Result.Should().BeOfType<OkObjectResult>();

			var okResult = result.Result as OkObjectResult;
			okResult.Should().NotBeNull();
			okResult!.Value.Should().BeEquivalentTo(expectedProductList);

			mockService.Verify(s => s.GetFormattedData(), Times.Once);
		}

		[Fact]
		public async Task GetProducts_WhenServiceReturnsEmptyList_ReturnsOkWithEmptyProductList()
		{
			// Arrange
			var expectedProductList = new ProductList
			{
				Data = new List<Product>(),
				Message = "Success"
			};

			var mockService = new Mock<IProductFetchService>();
			mockService
				.Setup(s => s.GetFormattedData())
				.ReturnsAsync(expectedProductList);

			var controller = new ProductController(mockService.Object);

			// Act
			var result = await controller.GetProducts();

			// Assert
			result.Should().NotBeNull();
			result.Result.Should().BeOfType<OkObjectResult>();

			var okResult = result.Result as OkObjectResult;
			var returnedProductList = okResult!.Value as ProductList;
			returnedProductList.Should().NotBeNull();
			returnedProductList!.Data.Should().BeEmpty();
			returnedProductList.Message.Should().Be("Success");
		}

		[Fact]
		public async Task GetProducts_WhenServiceReturnsError_ReturnsOkWithErrorMessage()
		{
			// Arrange
			var expectedProductList = new ProductList
			{
				Data = new List<Product>(),
				Message = "Error fetching data from the API."
			};

			var mockService = new Mock<IProductFetchService>();
			mockService
				.Setup(s => s.GetFormattedData())
				.ReturnsAsync(expectedProductList);

			var controller = new ProductController(mockService.Object);

			// Act
			var result = await controller.GetProducts();

			// Assert
			result.Should().NotBeNull();
			result.Result.Should().BeOfType<OkObjectResult>();

			var okResult = result.Result as OkObjectResult;
			var returnedProductList = okResult!.Value as ProductList;
			returnedProductList.Should().NotBeNull();
			returnedProductList!.Message.Should().Be("Error fetching data from the API.");
			returnedProductList.Data.Should().BeEmpty();
		}

		[Fact]
		public async Task GetProducts_CallsServiceOnce()
		{
			// Arrange
			var mockService = new Mock<IProductFetchService>();
			mockService
				.Setup(s => s.GetFormattedData())
				.ReturnsAsync(new ProductList { Data = new List<Product>(), Message = "Success" });

			var controller = new ProductController(mockService.Object);

			// Act
			await controller.GetProducts();

			// Assert
			mockService.Verify(s => s.GetFormattedData(), Times.Once);
		}
	}
}