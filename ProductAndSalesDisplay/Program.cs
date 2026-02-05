using ProductAndSalesDisplay.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register HttpClient and DataFetcherService
builder.Services.AddHttpClient<IProductFetchService, ProductFetchService>();
builder.Services.AddHttpClient<IProductSaleFetchService, ProductSaleFetchService>();

// Add CORS for React integration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Can change absed off configuration but should be good with default Vite port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");

// app.UseAuthorization();

app.MapControllers();

app.Run();
