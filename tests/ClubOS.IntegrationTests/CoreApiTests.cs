using System.Net.Http.Json;
using ClubOS.Application.Common.Models;
using ClubOS.Application.Features.Clubs.Queries;
using ClubOS.Application.Features.Players.Queries;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace ClubOS.IntegrationTests;

public class CoreApiTests : IClassFixture<WebApplicationFactory<ClubOS.API.Program>>
{
    private readonly WebApplicationFactory<ClubOS.API.Program> _factory;
    private readonly HttpClient _client;

    public CoreApiTests(WebApplicationFactory<ClubOS.API.Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
        // In a real scenario, we would inject a valid JWT here for Bearer Auth
        _client.DefaultRequestHeaders.Add("Authorization", "Bearer MOCK_TOKEN");
    }

    [Fact]
    public async Task GetDepartments_ReturnsSuccess()
    {
        // Arrange
        var clubId = Guid.NewGuid(); // Use a seeded club ID in a real test

        // Act
        var response = await _client.GetAsync($"/api/v1/clubs/{clubId}/departments");

        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<List<DepartmentDto>>>();
        Assert.True(result!.Success);
    }

    [Fact]
    public async Task GetPlayers_ReturnsPaginatedResult()
    {
        // Arrange
        var clubId = Guid.NewGuid();

        // Act
        var response = await _client.GetAsync($"/api/v1/clubs/{clubId}/players?page=1&pageSize=10");

        // Assert
        response.EnsureSuccessStatusCode();
        var result = await response.Content.ReadFromJsonAsync<ApiResponse<PaginatedResult<PlayerDto>>>();
        Assert.True(result!.Success);
        Assert.Equal(1, result.Data!.Page);
    }
}
