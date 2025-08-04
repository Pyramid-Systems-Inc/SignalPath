namespace Signalpath.Models
{
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

    public class PinDefinitionModel
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public double RelativeX { get; set; }
        public double RelativeY { get; set; }
        public string Type { get; set; } = "Generic";
    }
}