using System.Net;
using System.Text;
using System.Text.Json;
using FluentAssertions;
using Moq;
using Moq.Protected;
using Xunit;

public class ProductFetchServiceTests
{
	// Mock API response data
	private static string FakeApiResponse()
	{
		return """
    {
        "data": [
            {
                "id": 1,
                "description": "Test Product",
                "salesPrice": 99.99,
                "category": "Test",
                "image": "test.png"
            }
        ]
    }
    """;
	}

	// Mock HttpClient
	private static HttpClient CreateMockHttpClient(string responseContent)
	{
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
				Content = new StringContent(responseContent, Encoding.UTF8, "application/json")
			});

		return new HttpClient(handlerMock.Object)
		{
			BaseAddress = new Uri("https://fake-api.com/")
		};
	}


	[Fact]
	public class ProductFetchServiceTests
	{
		[Fact]
		public async Task GetFormattedData_WhenApiReturnsData_ReturnsProductList()
		{
			// Arrange
			var httpClient = CreateMockHttpClient(FakeApiResponse());
			var service = new ProductFetchService(httpClient);

			// Act
			var result = await service.GetFormattedData();

			// Assert
			result.Should().NotBeNull();
			result.Data.Should().HaveCount(1);

			var product = result.Data.First();
			product.id.Should().Be(1);
			product.description.Should().Be("Test Product");
			product.salesPrice.Should().Be(99.99m);
		}
	}
}