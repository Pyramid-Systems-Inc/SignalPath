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
        
        // Draw component body
        this.ctx.fillStyle = isSelected ? '#4CAF50' : '#2196F3';
        this.ctx.fillRect(component.x, component.y, component.width, component.height);
        
        // Draw component border
        this.ctx.strokeStyle = isSelected ? '#388E3C' : '#1976D2';
        this.ctx.lineWidth = 2 / this.zoomLevel;
        this.ctx.strokeRect(component.x, component.y, component.width, component.height);
        
        // Draw component label
        this.ctx.fillStyle = 'white';
        this.ctx.font = `${12 / this.zoomLevel}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(
            component.name || component.type,
            component.x + component.width / 2,
            component.y + component.height / 2
        );
        
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
        
        this.ctx.fillStyle = '#FF9800';
        this.ctx.beginPath();
        this.ctx.arc(pin.absoluteX, pin.absoluteY, 4 / this.zoomLevel, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.strokeStyle = '#F57C00';
        this.ctx.lineWidth = 1 / this.zoomLevel;
        this.ctx.stroke();
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