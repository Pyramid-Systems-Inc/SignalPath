using System.Collections.Generic;

namespace Signalpath.Models
{
    public class NetModel
    {
        public string Id { get; set; } = string.Empty;
        public List<string> PinIds { get; set; } = new();
        public List<WireSegmentModel> Segments { get; set; } = new();
        public string Name { get; set; } = string.Empty;
    }

    public class WireSegmentModel
    {
        public double StartX { get; set; }
        public double StartY { get; set; }
        public double EndX { get; set; }
        public double EndY { get; set; }
    }

    public class PointModel
    {
        public double X { get; set; }
        public double Y { get; set; }

        public PointModel(double x, double y)
        {
            X = x;
            Y = y;
        }
    }

    public class RectangleModel
    {
        public double X { get; set; }
        public double Y { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }

        public RectangleModel(double x, double y, double width, double height)
        {
            X = x;
            Y = y;
            Width = width;
            Height = height;
        }

        public bool Contains(PointModel point)
        {
            return point.X >= X && point.X <= X + Width &&
                   point.Y >= Y && point.Y <= Y + Height;
        }

        public bool Intersects(RectangleModel other)
        {
            return X < other.X + other.Width &&
                   X + Width > other.X &&
                   Y < other.Y + other.Height &&
                   Y + Height > other.Y;
        }
    }
}