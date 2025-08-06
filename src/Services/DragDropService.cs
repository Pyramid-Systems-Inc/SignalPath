using System;
using System.Threading.Tasks;
using Signalpath.Models;

namespace Signalpath.Services
{
    public class DragDropService : IDragDropService
    {
        private bool _isDragging;
        private ComponentDefinitionModel? _draggedComponent;
        
        public bool IsDragging => _isDragging;
        public ComponentDefinitionModel? DraggedComponent => _draggedComponent;
        
        public event Action<(double X, double Y)> DragPositionChanged;
        
        public Task StartDragAsync(ComponentDefinitionModel component)
        {
            _isDragging = true;
            _draggedComponent = component;
            return Task.CompletedTask;
        }
        
        public Task UpdateDragPositionAsync(double x, double y)
        {
            if (_isDragging)
            {
                DragPositionChanged?.Invoke((x, y));
            }
            return Task.CompletedTask;
        }
        
        public Task EndDragAsync()
        {
            _isDragging = false;
            _draggedComponent = null;
            return Task.CompletedTask;
        }
    }
}