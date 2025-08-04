using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Signalpath;
using Signalpath.Services;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Configure HttpClient with error handling
builder.Services.AddScoped(sp => new HttpClient {
    BaseAddress = new Uri(builder.HostEnvironment.BaseAddress),
    Timeout = TimeSpan.FromSeconds(30)
});

// Register SignalPath services
builder.Services.AddSingleton<SchematicState>();
builder.Services.AddSingleton<ComponentLibrary>();
builder.Services.AddSingleton<CanvasInterop>();

// Add error handling services
builder.Services.AddLogging(logging =>
{
    logging.SetMinimumLevel(LogLevel.Information);
    logging.AddProvider(new BrowserConsoleLoggerProvider());
});

// Build the host
var host = builder.Build();

try
{
    // Initialize services
    var schematicState = host.Services.GetRequiredService<SchematicState>();
    var componentLibrary = host.Services.GetRequiredService<ComponentLibrary>();
    
    // Run the application
    await host.RunAsync();
}
catch (Exception ex)
{
    Console.Error.WriteLine($"Application startup failed: {ex.Message}");
    Console.Error.WriteLine($"Stack trace: {ex.StackTrace}");
    throw;
}

// Browser console logger implementation
public class BrowserConsoleLoggerProvider : ILoggerProvider
{
    public ILogger CreateLogger(string categoryName)
    {
        return new BrowserConsoleLogger(categoryName);
    }

    public void Dispose()
    {
    }
}

public class BrowserConsoleLogger : ILogger
{
    private readonly string _categoryName;

    public BrowserConsoleLogger(string categoryName)
    {
        _categoryName = categoryName;
    }

    public IDisposable? BeginScope<TState>(TState state) where TState : notnull
    {
        return null;
    }

    public bool IsEnabled(LogLevel logLevel)
    {
        return logLevel >= LogLevel.Information;
    }

    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
    {
        if (!IsEnabled(logLevel))
        {
            return;
        }

        var message = formatter(state, exception);
        var logEntry = $"[{_categoryName}] {logLevel}: {message}";
        
        if (exception != null)
        {
            logEntry += $"\nException: {exception.Message}\nStack trace: {exception.StackTrace}";
        }

        switch (logLevel)
        {
            case LogLevel.Trace:
            case LogLevel.Debug:
                Console.WriteLine($"DEBUG: {logEntry}");
                break;
            case LogLevel.Information:
                Console.WriteLine($"INFO: {logEntry}");
                break;
            case LogLevel.Warning:
                Console.WriteLine($"WARN: {logEntry}");
                break;
            case LogLevel.Error:
            case LogLevel.Critical:
                Console.WriteLine($"ERROR: {logEntry}");
                break;
            default:
                Console.WriteLine($"LOG: {logEntry}");
                break;
        }
    }
}
