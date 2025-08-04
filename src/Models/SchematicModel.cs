using System.Collections.Generic;

namespace Signalpath.Models
{
    public class SchematicModel
    {
        public Dictionary<string, ComponentModel> Components { get; set; } = new();
        public Dictionary<string, NetModel> Nets { get; set; } = new();
        public List<string> ComponentIds { get; set; } = new();
        public string? SelectedComponentId { get; set; }
        public string? StatusMessage { get; set; }
        public double ZoomLevel { get; set; } = 1.0;
        public bool IsWiringMode { get; set; }
        public string? WiringStartPinId { get; set; }

        public SchematicModel()
        {
            // Initialize with default values
            StatusMessage = "Ready";
        }

        public int ComponentCount => Components.Count;
        public int NetCount => Nets.Count;
        public bool HasSelectedComponent => !string.IsNullOrEmpty(SelectedComponentId);
        public string ZoomPercentage => $"{System.Math.Round(ZoomLevel * 100)}%";
    }

    public class ProjectModel
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Version { get; set; } = "1.0.0";
        public System.DateTime CreatedAt { get; set; } = System.DateTime.Now;
        public System.DateTime ModifiedAt { get; set; } = System.DateTime.Now;
        public SchematicModel Schematic { get; set; } = new();
        public Dictionary<string, object> Metadata { get; set; } = new();
    }

    public class RecentProjectModel
    {
        public string Name { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public System.DateTime LastModified { get; set; }
        public string Thumbnail { get; set; } = string.Empty;
    }

    public class ApplicationSettingsModel
    {
        public double DefaultZoomLevel { get; set; } = 1.0;
        public bool ShowGrid { get; set; } = true;
        public int GridSize { get; set; } = 10;
        public bool SnapToGrid { get; set; } = true;
        public string Theme { get; set; } = "System";
        public bool AutoSave { get; set; } = true;
        public int AutoSaveInterval { get; set; } = 300; // seconds
        public string DefaultComponentLibrary { get; set; } = "Default";
        public List<string> RecentProjects { get; set; } = new();
        public int MaxRecentProjects { get; set; } = 10;
    }

    public class CanvasStateModel
    {
        public double OffsetX { get; set; }
        public double OffsetY { get; set; }
        public double Zoom { get; set; } = 1.0;
        public bool IsPanning { get; set; }
        public double PanStartX { get; set; }
        public double PanStartY { get; set; }
        public bool IsDragging { get; set; }
        public string? DraggedComponentId { get; set; }
        public double DragStartX { get; set; }
        public double DragStartY { get; set; }
        public bool IsDrawingWire { get; set; }
        public string? WireStartPinId { get; set; }
        public double WireEndX { get; set; }
        public double WireEndY { get; set; }
    }

    public class UndoRedoModel
    {
        public Stack<SchematicModel> UndoStack { get; set; } = new();
        public Stack<SchematicModel> RedoStack { get; set; } = new();
        public int MaxStackSize { get; set; } = 50;
        public bool CanUndo => UndoStack.Count > 0;
        public bool CanRedo => RedoStack.Count > 0;
    }
}