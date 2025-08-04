using System.Collections.Generic;

namespace Signalpath.Services
{
    public class ComponentDefinition
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public double Width { get; set; }
        public double Height { get; set; }
        public List<PinDefinition> Pins { get; set; } = new();
        public Dictionary<string, object> DefaultProperties { get; set; } = new();
    }

    public class PinDefinition
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public double RelativeX { get; set; }
        public double RelativeY { get; set; }
        public string Type { get; set; } = "Generic"; // Input, Output, Power, etc.
    }

    public class ComponentLibrary
    {
        public Dictionary<string, ComponentDefinition> Components { get; } = new();

        public ComponentLibrary()
        {
            // Initialize with basic components
            InitializeComponents();
        }

        private void InitializeComponents()
        {
            // Resistor component
            Components["resistor"] = new ComponentDefinition
            {
                Id = "resistor",
                Name = "Resistor",
                Description = "A resistor is a passive two-terminal electrical component that implements electrical resistance as a circuit element.",
                Icon = "🔧",
                Width = 60,
                Height = 20,
                Pins = new List<PinDefinition>
                {
                    new PinDefinition { Id = "1", Name = "Pin 1", RelativeX = 0, RelativeY = 10, Type = "Generic" },
                    new PinDefinition { Id = "2", Name = "Pin 2", RelativeX = 60, RelativeY = 10, Type = "Generic" }
                },
                DefaultProperties = new Dictionary<string, object>
                {
                    { "Resistance", "1kΩ" },
                    { "Tolerance", "5%" },
                    { "PowerRating", "0.25W" }
                }
            };

            // Op-Amp component
            Components["opamp"] = new ComponentDefinition
            {
                Id = "opamp",
                Name = "Operational Amplifier",
                Description = "An operational amplifier is a DC-coupled high-gain electronic voltage amplifier with differential inputs and a single output.",
                Icon = "🔈",
                Width = 80,
                Height = 60,
                Pins = new List<PinDefinition>
                {
                    new PinDefinition { Id = "1", Name = "Inverting Input", RelativeX = 0, RelativeY = 20, Type = "Input" },
                    new PinDefinition { Id = "2", Name = "Non-inverting Input", RelativeX = 0, RelativeY = 40, Type = "Input" },
                    new PinDefinition { Id = "3", Name = "Positive Supply", RelativeX = 40, RelativeY = 0, Type = "Power" },
                    new PinDefinition { Id = "4", Name = "Output", RelativeX = 80, RelativeY = 30, Type = "Output" },
                    new PinDefinition { Id = "5", Name = "Negative Supply", RelativeX = 40, RelativeY = 60, Type = "Power" }
                },
                DefaultProperties = new Dictionary<string, object>
                {
                    { "Gain", "100000" },
                    { "InputImpedance", "2MΩ" },
                    { "OutputImpedance", "75Ω" },
                    { "SlewRate", "0.5V/μs" }
                }
            };

            // Microphone component
            Components["microphone"] = new ComponentDefinition
            {
                Id = "microphone",
                Name = "Microphone",
                Description = "A microphone is a transducer that converts sound into an electrical signal.",
                Icon = "🎤",
                Width = 40,
                Height = 40,
                Pins = new List<PinDefinition>
                {
                    new PinDefinition { Id = "1", Name = "Positive", RelativeX = 20, RelativeY = 0, Type = "Power" },
                    new PinDefinition { Id = "2", Name = "Output", RelativeX = 40, RelativeY = 20, Type = "Output" },
                    new PinDefinition { Id = "3", Name = "Ground", RelativeX = 20, RelativeY = 40, Type = "Power" }
                },
                DefaultProperties = new Dictionary<string, object>
                {
                    { "Sensitivity", "-42dBV/Pa" },
                    { "Impedance", "2.2kΩ" },
                    { "FrequencyResponse", "20Hz-20kHz" },
                    { "PolarPattern", "Cardioid" }
                }
            };
        }

        public ComponentDefinition? GetComponent(string id)
        {
            return Components.TryGetValue(id, out var component) ? component : null;
        }

        public IEnumerable<ComponentDefinition> GetAllComponents()
        {
            return Components.Values;
        }
    }
}