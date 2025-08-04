using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.JSInterop;
using Signalpath.Models;

namespace Signalpath.Services
{
    public class CanvasInterop : IAsyncDisposable
    {
        private readonly IJSRuntime _jsRuntime;
        private bool _isInitialized = false;
        private string _canvasId = "schematic-canvas";

        public event Action<string>? OnComponentSelected;
        public event Action<string>? OnComponentMoved;
        public event Action<string, double, double>? OnComponentPositionChanged;
        public event Action<double>? OnZoomChanged;

        public CanvasInterop(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
        }

        public async Task InitializeAsync(string canvasId = "schematic-canvas")
        {
            _canvasId = canvasId;
            
            // Load the JavaScript module
            await _jsRuntime.InvokeVoidAsync("eval", @"
                (function() {
                    if (typeof window.initializeCanvas === 'undefined') {
                        var script = document.createElement('script');
                        script.src = 'js/canvasInterop.js';
                        script.onload = function() {
                            console.log('CanvasInterop.js loaded successfully');
                        };
                        document.head.appendChild(script);
                    }
                })();
            ");

            // Wait a bit for the script to load
            await Task.Delay(100);

            // Initialize the canvas
            _isInitialized = await _jsRuntime.InvokeAsync<bool>("initializeCanvas", _canvasId);
            
            if (_isInitialized)
            {
                Console.WriteLine("Canvas initialized successfully");
            }
            else
            {
                Console.WriteLine("Failed to initialize canvas");
            }
        }

        public async Task UpdateComponentsAsync(IEnumerable<ComponentModel> components)
        {
            if (!_isInitialized)
            {
                Console.WriteLine("Canvas not initialized");
                return;
            }

            // Convert components to a format that can be serialized to JavaScript
            var jsComponents = new List<object>();
            
            foreach (var component in components)
            {
                var jsComponent = new
                {
                    id = component.Id,
                    type = component.Type,
                    name = component.Name,
                    x = component.X,
                    y = component.Y,
                    width = component.Width,
                    height = component.Height,
                    isSelected = component.IsSelected,
                    pins = component.Pins.Values.Select(pin => new
                    {
                        id = pin.Id,
                        name = pin.Name,
                        relativeX = pin.RelativeX,
                        relativeY = pin.RelativeY,
                        absoluteX = pin.AbsoluteX,
                        absoluteY = pin.AbsoluteY,
                        type = pin.Type
                    }).ToList()
                };
                
                jsComponents.Add(jsComponent);
            }

            await _jsRuntime.InvokeVoidAsync("updateCanvasComponents", jsComponents);
        }

        public async Task SetZoomLevelAsync(double zoomLevel)
        {
            if (!_isInitialized)
            {
                Console.WriteLine("Canvas not initialized");
                return;
            }

            await _jsRuntime.InvokeVoidAsync("setCanvasZoom", zoomLevel);
        }

        public async Task SetPanAsync(double panX, double panY)
        {
            if (!_isInitialized)
            {
                Console.WriteLine("Canvas not initialized");
                return;
            }

            await _jsRuntime.InvokeVoidAsync("setCanvasPan", panX, panY);
        }

        // These methods will be called from JavaScript
        [JSInvokable]
        public static void HandleComponentSelected(string componentId)
        {
            // This will be handled by the instance through the event
            // We need to find a way to route this to the correct instance
            // For now, we'll use a static event or a service locator pattern
            Console.WriteLine($"Component selected: {componentId}");
        }

        [JSInvokable]
        public static void HandleComponentMoved(string componentId)
        {
            Console.WriteLine($"Component moved: {componentId}");
        }

        [JSInvokable]
        public static void HandleComponentPositionChanged(string componentId, double x, double y)
        {
            Console.WriteLine($"Component position changed: {componentId} at ({x}, {y})");
        }

        [JSInvokable]
        public static void HandleZoomChanged(double zoomLevel)
        {
            Console.WriteLine($"Zoom level changed: {zoomLevel}");
        }

        public async ValueTask DisposeAsync()
        {
            // Cleanup if needed
            _isInitialized = false;
        }
    }
}