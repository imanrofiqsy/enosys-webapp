// Global chart variables
let energyChart, pieChart, lineChart;

// Initialize on page load
window.addEventListener('load', function() {
    initializeCharts();
    loadThemePreference();
});

// Theme Toggle Function
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('dashboard-theme', newTheme);
    
    const icon = document.getElementById('theme-icon');
    icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Re-render charts with new theme
    setTimeout(() => {
        if (energyChart) energyChart.render();
        if (pieChart) pieChart.render();
        if (lineChart) lineChart.render();
    }, 100);
}

// Load saved theme
function loadThemePreference() {
    const savedTheme = localStorage.getItem('dashboard-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Initialize Charts
function initializeCharts() {
    // Energy Usage Stacked Column Chart
    energyChart = new CanvasJS.Chart("energyUsageChart", {
        animationEnabled: true,
        animationDuration: 2000,
        backgroundColor: "transparent",
        dataPointWidth: 40,
        axisY: {
            suffix: " kWh",
            gridDashType: "dash",
            tickLength: 0,
            lineThickness: 0,
            gridColor: "#ddd",
            labelFontColor: "#666",
            labelFontSize: 12
        },
        toolTip: {
            shared: false,
            content: "{name}: {y} kWh"
        },
        legend: {
            horizontalAlign: "center",
            verticalAlign: "bottom",
            fontSize: 11
        },
        data: [
            { type: "stackedColumn", name: "LT1", color: "#667eea", showInLegend: true, dataPoints: [] },
            { type: "stackedColumn", name: "LT2", color: "#764ba2", showInLegend: true, dataPoints: [] },
            { type: "stackedColumn", name: "LT3", color: "#f59e0b", showInLegend: true, dataPoints: [] },
            { type: "stackedColumn", name: "LIFT", color: "#10b981", showInLegend: true, dataPoints: [] },
            { type: "stackedColumn", name: "AC_ROOF", color: "#06b6d4", showInLegend: true, dataPoints: [] },
            { type: "stackedColumn", name: "MACHINE", color: "#8b5cf6", showInLegend: true, dataPoints: [] },
            { type: "stackedColumn", name: "SOLAR_PLN", color: "#ec4899", showInLegend: true, dataPoints: [] },
            { 
                type: "stackedColumn", 
                name: "PLN_LAMP", 
                color: "#f97316", 
                showInLegend: true,
                indexLabel: "#total kWh",
                indexLabelPlacement: "outside",
                indexLabelFontSize: 10,
                dataPoints: [] 
            }
        ]
    });

    // Pie Chart for Daily Energy Cost
    pieChart = new CanvasJS.Chart("dailyCostPieChart", {
        animationEnabled: true,
        animationDuration: 2000,
        backgroundColor: "transparent",
        data: [{
            type: "pie",
            indexLabel: "{y} kWh",
            indexLabelFontSize: 14,
            indexLabelPlacement: "outside",
            indexLabelFontWeight: "bold",
            startAngle: 40,
            toolTipContent: "{name}: {y} kWh ({percentage}%)",
            dataPoints: []
        }]
    });

    // Line Chart for Carbon Footprint
    lineChart = new CanvasJS.Chart("carbonFootprintChart", {
        animationEnabled: true,
        animationDuration: 2000,
        backgroundColor: "transparent",
        axisY: {
            suffix: " kg",
            gridDashType: "dash",
            tickLength: 0,
            lineThickness: 0,
            gridColor: "#ddd",
            labelFontColor: "#666"
        },
        axisX: {
            valueFormatString: "DD MMM",
            labelAngle: 0,
            xValueType: "dateTime"
        },
        legend: {
            horizontalAlign: "center",
            verticalAlign: "bottom",
            fontSize: 12
        },
        data: [{
            type: "splineArea",
            color: "#667eea",
            fillOpacity: 0.3,
            lineColor: "#667eea",
            markerColor: "#f59e0b",
            name: "Carbon Footprint",
            showInLegend: true,
            indexLabel: "{y} kg",
            dataPoints: []
        }]
    });

    energyChart.render();
    pieChart.render();
    lineChart.render();
}

// Responsive Charts
window.addEventListener('resize', function() {
    if (energyChart) energyChart.render();
    if (pieChart) pieChart.render();
    if (lineChart) lineChart.render();
});

// Energy Storage Gauge Chart
window.addEventListener('load', function() {
    const gaugeChart = new CanvasJS.Chart("energyStorageGauge", {
        animationEnabled: true,
        animationDuration: 2000,
        backgroundColor: "transparent",
        data: [{
            type: "doughnut",
            radius: "90%",
            innerRadius: "60%",
            indexLabel: "{y}%",
            indexLabelFontSize: 20,
            indexLabelFontWeight: "bold",
            indexLabelPlacement: "inside",
            dataPoints: [
                { y: 70, name: "Used", color: "#f59e0b" },
                { y: 30, name: "Available", color: "#10b981" }
            ]
        }]
    });
    gaugeChart.render();
});

let socket = new WebSocket("ws://127.0.0.1:8000/ws/chat/");

socket.onopen = () => {
    console.log("✅ Connected!");
    socket.send(JSON.stringify({message: "Halo dari client"}));
};

socket.onmessage = (event) => {
    let data = JSON.parse(event.data);
    console.log("📩 Pesan dari server:", data.message);
};