using System.Collections.Generic;

namespace Signalpath.Models
{
    // Core component model for instances on the canvas
    public class ComponentModel
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public double X { get; set; }
        public double Y { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public Dictionary<string, PinModel> Pins { get; set; } = new();
        public Dictionary<string, object> Properties { get; set; } = new();
        public bool IsSelected { get; set; } = false;
    }

    // Pin model for component instances
    public class PinModel
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public double RelativeX { get; set; }
        public double RelativeY { get; set; }
        public double AbsoluteX { get; set; }
        public double AbsoluteY { get; set; }
        public string Type { get; set; } = "Generic";
        public string? NetId { get; set; }
        public string ComponentId { get; set; } = string.Empty;
    }

    // Component definition model for library templates
    public class ComponentDefinitionModel
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public double Width { get; set; }
        public double Height { get; set; }
        public List<PinDefinitionModel> Pins { get; set; } = new();
        public Dictionary<string, object> DefaultProperties { get; set; } = new();
    }

    // Pin definition model for library templates
    public class PinDefinitionModel
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public double RelativeX { get; set; }
        public double RelativeY { get; set; }
        public string Type { get; set; } = "Generic";
    }

    // Legacy aliases for backward compatibility during migration
    // These will be removed once all services are updated to use the new models
    public class Component : ComponentModel
    {
        public Component() : base() { }
    }

    public class Pin : PinModel
    {
        public Pin() : base() { }
    }

    public class ComponentDefinition : ComponentDefinitionModel
    {
        public ComponentDefinition() : base() { }
    }

    public class PinDefinition : PinDefinitionModel
    {
        public PinDefinition() : base() { }
    }
}