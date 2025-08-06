using System;
using System.Threading.Tasks;
using Signalpath.Models;

namespace Signalpath.Services
{
    public interface IDragDropService
    {
        bool IsDragging { get; }
        ComponentDefinitionModel? DraggedComponent { get; }
        event Action<(double X, double Y)> DragPositionChanged;
        
        Task StartDragAsync(ComponentDefinitionModel component);
        Task UpdateDragPositionAsync(double x, double y);
        Task EndDragAsync();
    }
}