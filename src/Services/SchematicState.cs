using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace Signalpath.Services
{
    public class Pin
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

    public class WireSegment
    {
        public double StartX { get; set; }
        public double StartY { get; set; }
        public double EndX { get; set; }
        public double EndY { get; set; }
    }

    public class Net
    {
        public string Id { get; set; } = string.Empty;
        public List<string> PinIds { get; set; } = new();
        public List<WireSegment> Segments { get; set; } = new();
        public string Name { get; set; } = string.Empty;
    }

    public class Component
    {
        public string Id { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public double X { get; set; }
        public double Y { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public Dictionary<string, Pin> Pins { get; set; } = new();
        public Dictionary<string, object> Properties { get; set; } = new();
        public bool IsSelected { get; set; } = false;
    }

    public class SchematicState : INotifyPropertyChanged
    {
        private string? _selectedComponentId;
        private string? _statusMessage;
        private double _zoomLevel = 1.0;
        private bool _isWiringMode;
        private string? _wiringStartPinId;

        public Dictionary<string, Component> Components { get; } = new();
        public Dictionary<string, Net> Nets { get; } = new();
        public List<string> ComponentIds { get; } = new();

        public string? SelectedComponentId
        {
            get => _selectedComponentId;
            set
            {
                if (_selectedComponentId != value)
                {
                    // Deselect previously selected component
                    if (!string.IsNullOrEmpty(_selectedComponentId) && Components.TryGetValue(_selectedComponentId, out var prevComponent))
                    {
                        prevComponent.IsSelected = false;
                    }

                    _selectedComponentId = value;

                    // Select new component
                    if (!string.IsNullOrEmpty(_selectedComponentId) && Components.TryGetValue(_selectedComponentId, out var newComponent))
                    {
                        newComponent.IsSelected = true;
                    }

                    OnPropertyChanged(nameof(SelectedComponentId));
                    OnPropertyChanged(nameof(SelectedComponent));
                    OnPropertyChanged(nameof(HasSelectedComponent));
                }
            }
        }

        public Component? SelectedComponent
        {
            get
            {
                return !string.IsNullOrEmpty(SelectedComponentId) && 
                       Components.TryGetValue(SelectedComponentId, out var component) 
                       ? component 
                       : null;
            }
        }

        public bool HasSelectedComponent => !string.IsNullOrEmpty(SelectedComponentId);

        public string? StatusMessage
        {
            get => _statusMessage;
            set
            {
                if (_statusMessage != value)
                {
                    _statusMessage = value;
                    OnPropertyChanged(nameof(StatusMessage));
                }
            }
        }

        public double ZoomLevel
        {
            get => _zoomLevel;
            set
            {
                if (_zoomLevel != value)
                {
                    _zoomLevel = Math.Max(0.1, Math.Min(5.0, value)); // Clamp between 0.1x and 5x
                    OnPropertyChanged(nameof(ZoomLevel));
                    OnPropertyChanged(nameof(ZoomPercentage));
                }
            }
        }

        public string ZoomPercentage => $"{Math.Round(ZoomLevel * 100)}%";

        public bool IsWiringMode
        {
            get => _isWiringMode;
            set
            {
                if (_isWiringMode != value)
                {
                    _isWiringMode = value;
                    OnPropertyChanged(nameof(IsWiringMode));
                    
                    // Reset wiring state when exiting wiring mode
                    if (!_isWiringMode)
                    {
                        WiringStartPinId = null;
                    }
                }
            }
        }

        public string? WiringStartPinId
        {
            get => _wiringStartPinId;
            set
            {
                if (_wiringStartPinId != value)
                {
                    _wiringStartPinId = value;
                    OnPropertyChanged(nameof(WiringStartPinId));
                    OnPropertyChanged(nameof(WiringStartPin));
                }
            }
        }

        public Pin? WiringStartPin
        {
            get
            {
                if (string.IsNullOrEmpty(WiringStartPinId))
                    return null;

                foreach (var component in Components.Values)
                {
                    if (component.Pins.TryGetValue(WiringStartPinId, out var pin))
                        return pin;
                }
                return null;
            }
        }

        public event PropertyChangedEventHandler? PropertyChanged;

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        public void AddComponent(Component component)
        {
            if (string.IsNullOrEmpty(component.Id))
                throw new ArgumentException("Component ID cannot be null or empty");

            Components[component.Id] = component;
            ComponentIds.Add(component.Id);
            
            // Update pin absolute positions
            UpdatePinPositions(component);
            
            OnPropertyChanged(nameof(Components));
            OnPropertyChanged(nameof(ComponentIds));
            OnPropertyChanged(nameof(ComponentCount));
            StatusMessage = $"Added {component.Name} ({component.Type})";
        }

        public bool RemoveComponent(string componentId)
        {
            if (!Components.TryGetValue(componentId, out var component))
                return false;

            // Remove any nets connected to this component's pins
            var pinsToRemove = new List<string>();
            foreach (var pin in component.Pins.Values)
            {
                if (!string.IsNullOrEmpty(pin.NetId))
                {
                    pinsToRemove.Add(pin.Id);
                }
            }

            foreach (var pinId in pinsToRemove)
            {
                RemovePinFromNets(pinId);
            }

            // Remove the component
            Components.Remove(componentId);
            ComponentIds.Remove(componentId);

            // Clear selection if this component was selected
            if (SelectedComponentId == componentId)
            {
                SelectedComponentId = null;
            }

            OnPropertyChanged(nameof(Components));
            OnPropertyChanged(nameof(ComponentIds));
            OnPropertyChanged(nameof(ComponentCount));
            StatusMessage = $"Removed {component.Name} ({component.Type})";
            
            return true;
        }

        public void UpdateComponentPosition(string componentId, double x, double y)
        {
            if (!Components.TryGetValue(componentId, out var component))
                return;

            component.X = x;
            component.Y = y;
            
            // Update pin absolute positions
            UpdatePinPositions(component);
            
            OnPropertyChanged(nameof(Components));
        }

        private void UpdatePinPositions(Component component)
        {
            foreach (var pin in component.Pins.Values)
            {
                pin.AbsoluteX = component.X + pin.RelativeX;
                pin.AbsoluteY = component.Y + pin.RelativeY;
            }
        }

        public void AddNet(Net net)
        {
            if (string.IsNullOrEmpty(net.Id))
                throw new ArgumentException("Net ID cannot be null or empty");

            Nets[net.Id] = net;
            
            // Update pin net references
            foreach (var pinId in net.PinIds)
            {
                SetPinNet(pinId, net.Id);
            }
            
            OnPropertyChanged(nameof(Nets));
            OnPropertyChanged(nameof(NetCount));
        }

        public bool RemoveNet(string netId)
        {
            if (!Nets.TryGetValue(netId, out var net))
                return false;

            // Clear net references from pins
            foreach (var pinId in net.PinIds)
            {
                SetPinNet(pinId, null);
            }

            Nets.Remove(netId);
            
            OnPropertyChanged(nameof(Nets));
            OnPropertyChanged(nameof(NetCount));
            
            return true;
        }

        private void SetPinNet(string pinId, string? netId)
        {
            foreach (var component in Components.Values)
            {
                if (component.Pins.TryGetValue(pinId, out var pin))
                {
                    pin.NetId = netId;
                    break;
                }
            }
        }

        private void RemovePinFromNets(string pinId)
        {
            var netsToRemove = new List<string>();
            
            foreach (var net in Nets.Values)
            {
                if (net.PinIds.Contains(pinId))
                {
                    net.PinIds.Remove(pinId);
                    
                    // Remove net if it has less than 2 pins
                    if (net.PinIds.Count < 2)
                    {
                        netsToRemove.Add(net.Id);
                    }
                }
            }
            
            foreach (var netId in netsToRemove)
            {
                RemoveNet(netId);
            }
        }

        public int ComponentCount => Components.Count;
        public int NetCount => Nets.Count;
    }
}