// Canvas Interop for SignalPath Project
class CanvasInterop {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isInitialized = false;
        this.components = [];
        this.zoomLevel = 1.0;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.selectedComponentId = null;
    }

    // Initialize the canvas
    initialize(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas with id '${canvasId}' not found`);
            return false;
        }

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Failed to get 2D context');
            return false;
        }

        this.setupEventListeners();
        this.isInitialized = true;
        this.resizeCanvas();
        this.render();

        return true;
    }

    // Setup event listeners for canvas interactions
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));

        // Touch events for mobile support
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // Window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    // Resize canvas to fit its container
    resizeCanvas() {
        if (!this.canvas) return;

        const container = this.canvas.parentElement;
        if (container) {
            this.canvas.width = container.clientWidth;
            this.canvas.height = container.clientHeight;
            this.render();
        }
    }

    // Handle mouse down event
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - this.panX) / this.zoomLevel;
        const y = (e.clientY - rect.top - this.panY) / this.zoomLevel;

        // Check if clicking on a component
        const clickedComponent = this.getComponentAt(x, y);
        
        if (clickedComponent) {
            // Select component
            this.selectedComponentId = clickedComponent.id;
            this.notifyComponentSelected(clickedComponent.id);
            
            // Start dragging component
            this.isDragging = true;
            this.lastX = x;
            this.lastY = y;
        } else {
            // Start panning
            this.isDragging = true;
            this.lastX = e.clientX - rect.left;
            this.lastY = e.clientY - rect.top;
        }

        this.render();
    }

    // Handle mouse move event
    handleMouseMove(e) {
        if (!this.isDragging) return;

        const rect = this.canvas.getBoundingClientRect();
        
        if (this.selectedComponentId) {
            // Drag component
            const x = (e.clientX - rect.left - this.panX) / this.zoomLevel;
            const y = (e.clientY - rect.top - this.panY) / this.zoomLevel;
            
            const dx = x - this.lastX;
            const dy = y - this.lastY;
            
            this.moveComponent(this.selectedComponentId, dx, dy);
            
            this.lastX = x;
            this.lastY = y;
        } else {
            // Pan canvas
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.panX += x - this.lastX;
            this.panY += y - this.lastY;
            
            this.lastX = x;
            this.lastY = y;
        }

        this.render();
    }

    // Handle mouse up event
    handleMouseUp(e) {
        if (this.isDragging && this.selectedComponentId) {
            // Notify component movement completed
            this.notifyComponentMoved(this.selectedComponentId);
        }
        
        this.isDragging = false;
    }

    // Handle mouse wheel event for zooming
    handleWheel(e) {
        e.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoomLevel = Math.max(0.1, Math.min(5.0, this.zoomLevel * zoomFactor));
        
        // Zoom towards mouse position
        this.panX = mouseX - (mouseX - this.panX) * (newZoomLevel / this.zoomLevel);
        this.panY = mouseY - (mouseY - this.panY) * (newZoomLevel / this.zoomLevel);
        
        this.zoomLevel = newZoomLevel;
        
        this.notifyZoomChanged(this.zoomLevel);
        this.render();
    }

    // Touch event handlers (simplified)
    handleTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.handleMouseDown(mouseEvent);
        }
        e.preventDefault();
    }

    handleTouchMove(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.handleMouseMove(mouseEvent);
        }
        e.preventDefault();
    }

    handleTouchEnd(e) {
        const mouseEvent = new MouseEvent('mouseup', {});
        this.handleMouseUp(mouseEvent);
        e.preventDefault();
    }

    // Get component at given coordinates
    getComponentAt(x, y) {
        for (let i = this.components.length - 1; i >= 0; i--) {
            const comp = this.components[i];
            if (x >= comp.x && x <= comp.x + comp.width &&
                y >= comp.y && y <= comp.y + comp.height) {
                return comp;
            }
        }
        return null;
    }

    // Move component by delta
    moveComponent(componentId, dx, dy) {
        const component = this.components.find(c => c.id === componentId);
        if (component) {
            component.x += dx;
            component.y += dy;
            
            // Update pin positions
            if (component.pins) {
                component.pins.forEach(pin => {
                    pin.absoluteX = component.x + pin.relativeX;
                    pin.absoluteY = component.y + pin.relativeY;
                });
            }
            
            this.notifyComponentPositionChanged(componentId, component.x, component.y);
        }
    }

    // Update components from C#
    updateComponents(components) {
        this.components = components;
        this.render();
    }

    // Set zoom level
    setZoomLevel(zoomLevel) {
        this.zoomLevel = Math.max(0.1, Math.min(5.0, zoomLevel));
        this.render();
    }

    // Set pan position
    setPan(panX, panY) {
        this.panX = panX;
        this.panY = panY;
        this.render();
    }

    // Clear canvas
    clear() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Render all components
    render() {
        if (!this.ctx || !this.canvas) return;
        
        this.clear();
        
        // Save context state
        this.ctx.save();
        
        // Apply zoom and pan
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.zoomLevel, this.zoomLevel);
        
        // Draw grid
        this.drawGrid();
        
        // Draw components
        this.components.forEach(component => {
            this.drawComponent(component);
        });
        
        // Draw wires (if any)
        this.drawWires();
        
        // Restore context state
        this.ctx.restore();
    }

    // Draw background grid
    drawGrid() {
        if (!this.ctx) return;
        
        const gridSize = 20;
        const startX = Math.floor(-this.panX / this.zoomLevel / gridSize) * gridSize;
        const startY = Math.floor(-this.panY / this.zoomLevel / gridSize) * gridSize;
        const endX = startX + Math.ceil(this.canvas.width / this.zoomLevel) + gridSize;
        const endY = startY + Math.ceil(this.canvas.height / this.zoomLevel) + gridSize;
        
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1 / this.zoomLevel;
        
        // Draw vertical lines
        for (let x = startX; x <= endX; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
            this.ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = startY; y <= endY; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(endX, y);
            this.ctx.stroke();
        }
    }

    // Draw a single component
    drawComponent(component) {
        if (!this.ctx) return;
        
        const isSelected = component.id === this.selectedComponentId;
        
        // Draw component shadow for depth
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 4 / this.zoomLevel;
        this.ctx.shadowOffsetX = 2 / this.zoomLevel;
        this.ctx.shadowOffsetY = 2 / this.zoomLevel;
        this.ctx.fillRect(component.x + 2, component.y + 2, component.width, component.height);
        this.ctx.restore();
        
        // Draw component body with gradient
        const gradient = this.ctx.createLinearGradient(
            component.x, component.y,
            component.x, component.y + component.height
        );
        
        if (isSelected) {
            gradient.addColorStop(0, '#66BB6A');
            gradient.addColorStop(1, '#4CAF50');
        } else {
            gradient.addColorStop(0, '#42A5F5');
            gradient.addColorStop(1, '#2196F3');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(component.x, component.y, component.width, component.height);
        
        // Draw component border with rounded corners effect
        this.ctx.strokeStyle = isSelected ? '#388E3C' : '#1976D2';
        this.ctx.lineWidth = 2 / this.zoomLevel;
        this.ctx.strokeRect(component.x, component.y, component.width, component.height);
        
        // Draw inner border for depth
        this.ctx.strokeStyle = isSelected ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1 / this.zoomLevel;
        this.ctx.strokeRect(
            component.x + 2 / this.zoomLevel,
            component.y + 2 / this.zoomLevel,
            component.width - 4 / this.zoomLevel,
            component.height - 4 / this.zoomLevel
        );
        
        // Draw component label with proper text scaling
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Calculate text bounds and ensure it fits within component
        const text = component.name || component.type;
        const textX = component.x + component.width / 2;
        const textY = component.y + component.height / 2;
        
        // Scale font size based on zoom level but ensure readability
        const minFontSize = 8;
        const maxFontSize = 16;
        let fontSize = Math.max(minFontSize, Math.min(maxFontSize, 12 / this.zoomLevel));
        this.ctx.font = `bold ${fontSize}px Arial`;
        
        // Add text shadow for better visibility
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        this.ctx.shadowBlur = 3 / this.zoomLevel;
        this.ctx.shadowOffsetX = 1 / this.zoomLevel;
        this.ctx.shadowOffsetY = 1 / this.zoomLevel;
        
        // Measure text to ensure it fits
        const textMetrics = this.ctx.measureText(text);
        const maxWidth = component.width - 10; // 5px padding on each side
        
        if (textMetrics.width > maxWidth) {
            // Truncate text if it's too long
            let truncatedText = text;
            while (this.ctx.measureText(truncatedText + '...').width > maxWidth && truncatedText.length > 0) {
                truncatedText = truncatedText.slice(0, -1);
            }
            this.ctx.fillText(truncatedText + '...', textX, textY);
        } else {
            this.ctx.fillText(text, textX, textY);
        }
        
        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        
        // Draw component type label (smaller text below main label)
        if (component.type && component.type !== component.name) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.font = `${Math.max(6, fontSize - 3)}px Arial`;
            this.ctx.fillText(
                component.type,
                textX,
                textY + fontSize + 5
            );
        }
        
        // Draw pins
        if (component.pins) {
            component.pins.forEach(pin => {
                this.drawPin(pin);
            });
        }
    }

    // Draw a single pin
    drawPin(pin) {
        if (!this.ctx) return;
        
        // Draw pin shadow
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(
            pin.absoluteX + 1 / this.zoomLevel,
            pin.absoluteY + 1 / this.zoomLevel,
            4 / this.zoomLevel,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
        this.ctx.restore();
        
        // Draw pin with gradient
        const pinGradient = this.ctx.createRadialGradient(
            pin.absoluteX - 1 / this.zoomLevel,
            pin.absoluteY - 1 / this.zoomLevel,
            0,
            pin.absoluteX,
            pin.absoluteY,
            4 / this.zoomLevel
        );
        pinGradient.addColorStop(0, '#FFB74D');
        pinGradient.addColorStop(1, '#FF9800');
        
        this.ctx.fillStyle = pinGradient;
        this.ctx.beginPath();
        this.ctx.arc(pin.absoluteX, pin.absoluteY, 4 / this.zoomLevel, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Draw pin border
        this.ctx.strokeStyle = '#F57C00';
        this.ctx.lineWidth = 1.5 / this.zoomLevel;
        this.ctx.stroke();
        
        // Draw pin highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(
            pin.absoluteX - 1 / this.zoomLevel,
            pin.absoluteY - 1 / this.zoomLevel,
            1 / this.zoomLevel,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
        
        // Draw pin name if zoomed in enough
        if (this.zoomLevel > 0.8 && pin.name) {
            this.ctx.fillStyle = '#333';
            this.ctx.font = `${Math.max(8, 10 / this.zoomLevel)}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'top';
            
            // Position text based on pin position relative to component
            const textX = pin.absoluteX;
            const textY = pin.absoluteY + 6 / this.zoomLevel;
            
            // Add text background for better readability
            const textMetrics = this.ctx.measureText(pin.name);
            const padding = 2 / this.zoomLevel;
            
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            this.ctx.fillRect(
                textX - textMetrics.width / 2 - padding,
                textY - padding,
                textMetrics.width + padding * 2,
                parseInt(this.ctx.font) + padding * 2
            );
            
            this.ctx.fillStyle = '#333';
            this.ctx.fillText(pin.name, textX, textY);
        }
    }

    // Draw wires (placeholder for now)
    drawWires() {
        // Wire drawing will be implemented when wiring system is added
    }

    // Notification methods (to be called from C#)
    notifyComponentSelected(componentId) {
        if (window.DotNet && window.DotNet.invokeMethodAsync) {
            window.DotNet.invokeMethodAsync('Signalpath', 'HandleComponentSelected', componentId);
        }
    }

    notifyComponentMoved(componentId) {
        if (window.DotNet && window.DotNet.invokeMethodAsync) {
            window.DotNet.invokeMethodAsync('Signalpath', 'HandleComponentMoved', componentId);
        }
    }

    notifyComponentPositionChanged(componentId, x, y) {
        if (window.DotNet && window.DotNet.invokeMethodAsync) {
            window.DotNet.invokeMethodAsync('Signalpath', 'HandleComponentPositionChanged', componentId, x, y);
        }
    }

    notifyZoomChanged(zoomLevel) {
        if (window.DotNet && window.DotNet.invokeMethodAsync) {
            window.DotNet.invokeMethodAsync('Signalpath', 'HandleZoomChanged', zoomLevel);
        }
    }
}

// Create global instance
window.canvasInterop = new CanvasInterop();

// Initialization function that can be called from .NET
window.initializeCanvas = function (canvasId) {
    return window.canvasInterop.initialize(canvasId);
};

// Update components function that can be called from .NET
window.updateCanvasComponents = function (components) {
    window.canvasInterop.updateComponents(components);
};

// Set zoom level function that can be called from .NET
window.setCanvasZoom = function (zoomLevel) {
    window.canvasInterop.setZoomLevel(zoomLevel);
};

// Set pan position function that can be called from .NET
window.setCanvasPan = function (panX, panY) {
    window.canvasInterop.setPan(panX, panY);
};