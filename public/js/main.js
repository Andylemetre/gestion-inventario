// Configuración de la API
const API_URL = window.location.origin;

let inventory = [];
let tools = [];
let movements = [];
let currentFilter = 'todos';
let currentLocationFilter = 'todas';

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
});

async function loadAllData() {
    await loadInventory();
    await loadTools();
    await loadMovements();
    await loadLocationCounts();
}

// ==================== FUNCIONES DE NAVEGACIÓN ====================
function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`tab-${tab}`).classList.remove('hidden');

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.tab-btn').classList.add('active');
}

// ==================== API - INSUMOS ====================
async function loadInventory() {
    try {
        const response = await fetch(`${API_URL}/api/inventory`);
        const result = await response.json();
        if (result.success) {
            inventory = result.data.map(item => ({
                id: item.id,
                name: item.nombre,
                quantity: parseFloat(item.cantidad),
                unit: item.unidad,
                minStock: parseFloat(item.stock_minimo)
            }));
            updateInventoryTable();
        }
    } catch (error) {
        console.error('Error al cargar insumos:', error);
        showNotification('Error al cargar insumos', 'error');
    }
}

async function saveInventory(data) {
    try {
        const response = await fetch(`${API_URL}/api/inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: data.name,
                cantidad: data.quantity,
                unidad: data.unit,
                stock_minimo: data.minStock
            })
        });
        const result = await response.json();
        if (result.success) {
            showNotification(result.message, 'success');
            await loadInventory();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error al guardar insumo:', error);
        showNotification('Error al guardar insumo', 'error');
    }
}

async function deleteInventoryItem(id) {
    try {
        const response = await fetch(`${API_URL}/api/inventory/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
            showNotification(result.message, 'success');
            await loadInventory();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error al eliminar insumo:', error);
        showNotification('Error al eliminar insumo', 'error');
    }
}

// ==================== API - HERRAMIENTAS ====================
async function loadTools() {
    try {
        const url = currentLocationFilter !== 'todas'
            ? `${API_URL}/api/tools?ubicacion=${currentLocationFilter}`
            : `${API_URL}/api/tools`;

        const response = await fetch(url);
        const result = await response.json();
        if (result.success) {
            tools = result.data.map(tool => ({
                id: tool.id,
                name: tool.nombre,
                quantity: parseInt(tool.cantidad),
                category: tool.categoria,
                location: tool.ubicacion
            }));
            updateToolsTable();
        }
    } catch (error) {
        console.error('Error al cargar herramientas:', error);
        showNotification('Error al cargar herramientas', 'error');
    }
}

async function saveTool(data) {
    try {
        const response = await fetch(`${API_URL}/api/tools`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: data.name,
                cantidad: data.quantity,
                categoria: data.category,
                ubicacion: data.location
            })
        });
        const result = await response.json();
        if (result.success) {
            showNotification(result.message, 'success');
            await loadTools();
            await loadLocationCounts();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error al guardar herramienta:', error);
        showNotification('Error al guardar herramienta', 'error');
    }
}

async function deleteToolItem(id) {
    try {
        const response = await fetch(`${API_URL}/api/tools/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (result.success) {
            showNotification(result.message, 'success');
            await loadTools();
            await loadLocationCounts();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error al eliminar herramienta:', error);
        showNotification('Error al eliminar herramienta', 'error');
    }
}

async function loadLocationCounts() {
    try {
        const response = await fetch(`${API_URL}/api/tools/counts`);
        const result = await response.json();
        if (result.success) {
            const counts = result.data;
            Object.keys(counts).forEach(location => {
                const countEl = document.getElementById(`count-${location}`);
                if (countEl) countEl.textContent = counts[location];
            });
        }
    } catch (error) {
        console.error('Error al cargar conteos:', error);
    }
}

// ==================== API - MOVIMIENTOS ====================
async function loadMovements() {
    try {
        const url = currentFilter !== 'todos'
            ? `${API_URL}/api/movements?tipo=${currentFilter}`
            : `${API_URL}/api/movements`;

        const response = await fetch(url);
        const result = await response.json();
        if (result.success) {
            movements = result.data.map(mov => ({
                date: new Date(mov.fecha).toLocaleString('es-ES'),
                item: mov.elemento_nombre,
                type: mov.tipo_movimiento,
                category: mov.tipo_elemento,
                quantity: parseFloat(mov.cantidad),
                unit: mov.unidad,
                reason: mov.motivo
            }));
            updateMovementTable();
        }
    } catch (error) {
        console.error('Error al cargar movimientos:', error);
        showNotification('Error al cargar movimientos', 'error');
    }
}

async function saveInventoryMovement(data) {
    try {
        const response = await fetch(`${API_URL}/api/movements/inventory`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: data.itemName,
                tipo: data.type,
                cantidad: data.quantity,
                motivo: data.reason
            })
        });
        const result = await response.json();
        if (result.success) {
            showNotification(result.message, 'success');
            await loadInventory();
            await loadMovements();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error al registrar movimiento:', error);
        showNotification('Error al registrar movimiento', 'error');
    }
}

async function saveToolMovement(data) {
    try {
        const response = await fetch(`${API_URL}/api/movements/tool`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: data.toolName,
                tipo: data.type,
                cantidad: data.quantity,
                motivo: data.reason
            })
        });
        const result = await response.json();
        if (result.success) {
            showNotification(result.message, 'success');
            await loadTools();
            await loadMovements();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error al registrar movimiento:', error);
        showNotification('Error al registrar movimiento', 'error');
    }
}

// ==================== ACTUALIZAR TABLAS ====================
function updateInventoryTable() {
    const tableBody = document.getElementById('inventory-table');
    tableBody.innerHTML = '';
    if (inventory.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-gray-500">Sin insumos registrados</td></tr>';
        updateMovementSelect();
        return;
    }
    inventory.forEach((item) => {
        const isLowStock = item.quantity <= item.minStock;
        const row = document.createElement('tr');
        row.className = `table-row ${isLowStock ? 'low-stock' : ''}`;
        row.innerHTML = `
            <td class="p-4 font-semibold text-gray-800">${item.name}</td>
            <td class="p-4 text-gray-600">${item.quantity}</td>
            <td class="p-4 text-gray-600">${item.unit}</td>
            <td class="p-4 text-gray-600">${item.minStock}</td>
            <td class="p-4">
                <span class="badge ${isLowStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
                    ${isLowStock ? '⚠️ Bajo Stock' : '✓ OK'}
                </span>
            </td>
            <td class="p-4 text-center flex gap-2 justify-center">
                <button onclick="editItem(${item.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteItem(${item.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    updateMovementSelect();
}

function updateToolsTable() {
    const tableBody = document.getElementById('tools-table');
    tableBody.innerHTML = '';

    if (tools.length === 0) {
        const msg = currentLocationFilter === 'todas'
            ? 'Sin herramientas registradas'
            : `Sin herramientas en ${currentLocationFilter}`;
        tableBody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-gray-500">${msg}</td></tr>`;
        updateToolMovementSelect();
        return;
    }

    tools.forEach((tool) => {
        const row = document.createElement('tr');
        row.className = 'table-row';

        const locationColors = {
            'bodega': 'bg-green-100 text-green-700',
            'taller': 'bg-orange-100 text-orange-700',
            'pañol': 'bg-purple-100 text-purple-700'
        };

        const locationIcons = {
            'bodega': 'fa-warehouse',
            'taller': 'fa-tools',
            'pañol': 'fa-box'
        };

        row.innerHTML = `
            <td class="p-4 font-semibold text-gray-800">${tool.name}</td>
            <td class="p-4 text-gray-600">${tool.quantity}</td>
            <td class="p-4"><span class="badge bg-blue-100 text-blue-700">${tool.category}</span></td>
            <td class="p-4">
                <span class="badge ${locationColors[tool.location]}">
                    <i class="fas ${locationIcons[tool.location]} mr-1"></i>${tool.location.charAt(0).toUpperCase() + tool.location.slice(1)}
                </span>
            </td>
            <td class="p-4"><span class="badge bg-green-100 text-green-700">✓ Disponible</span></td>
            <td class="p-4 text-center flex gap-2 justify-center">
                <button onclick="editTool(${tool.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteTool(${tool.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    updateToolMovementSelect();
}

function updateMovementTable() {
    const tableBody = document.getElementById('movement-table');
    tableBody.innerHTML = '';

    if (movements.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-gray-500">Sin movimientos registrados</td></tr>';
        return;
    }
    movements.forEach(movement => {
        const row = document.createElement('tr');
        row.className = 'table-row';
        row.innerHTML = `
            <td class="p-4 text-gray-600">${movement.date}</td>
            <td class="p-4"><span class="badge ${movement.category === 'insumo' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}">${movement.category === 'insumo' ? 'Insumo' : 'Herramienta'}</span></td>
            <td class="p-4 font-semibold text-gray-800">${movement.item}</td>
            <td class="p-4"><span class="badge ${movement.type === 'entrada' ? 'badge-entrada' : 'badge-salida'}">${movement.type === 'entrada' ? '↓ Entrada' : '↑ Salida'}</span></td>
            <td class="p-4 text-gray-600">${movement.quantity} ${movement.unit}</td>
            <td class="p-4 text-gray-600">${movement.reason}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateMovementSelect() {
    const select = document.getElementById('movement-item');
    select.innerHTML = '<option value="">Seleccionar insumo</option>';
    inventory.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = `${item.name} (${item.unit})`;
        select.appendChild(option);
    });
}

function updateToolMovementSelect() {
    const select = document.getElementById('tool-movement-item');
    select.innerHTML = '<option value="">Seleccionar herramienta</option>';
    tools.forEach(tool => {
        const option = document.createElement('option');
        option.value = tool.name;
        option.textContent = `${tool.name} - ${tool.location}`;
        select.appendChild(option);
    });
}

// ==================== FILTROS ====================
function filterByLocation(location) {
    currentLocationFilter = location;

    document.querySelectorAll('.location-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.target.closest('.location-card').classList.add('selected');

    const filterText = location === 'todas'
        ? ''
        : `- Mostrando: ${location.charAt(0).toUpperCase() + location.slice(1)}`;
    document.getElementById('location-filter-text').textContent = filterText;

    loadTools();
}

function filterMovements(type) {
    currentFilter = type;
    document.querySelectorAll('[onclick^="filterMovements"]').forEach(btn => {
        btn.classList.remove('!bg-indigo-100', '!text-indigo-600', 'bg-indigo-100', 'text-indigo-600');
        btn.classList.add('bg-gray-100', 'text-gray-600');
    });
    event.target.classList.remove('bg-gray-100', 'text-gray-600');
    event.target.classList.add('bg-indigo-100', 'text-indigo-600');
    loadMovements();
}

// ==================== FORMULARIOS ====================
document.getElementById('inventory-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('item-name').value.trim();
    const quantity = parseFloat(document.getElementById('item-quantity').value);
    const unit = document.getElementById('item-unit').value;
    const minStock = parseFloat(document.getElementById('item-min').value);

    if (name && quantity >= 0 && unit && minStock >= 0) {
        await saveInventory({ name, quantity, unit, minStock });
        this.reset();
    } else {
        showNotification('Por favor, completa todos los campos correctamente.', 'error');
    }
});

document.getElementById('tools-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('tool-name').value.trim();
    const quantity = parseInt(document.getElementById('tool-quantity').value);
    const category = document.getElementById('tool-category').value;
    const location = document.getElementById('tool-location').value;

    if (name && quantity >= 0 && category && location) {
        await saveTool({ name, quantity, category, location });
        this.reset();
    } else {
        showNotification('Por favor, completa todos los campos correctamente.', 'error');
    }
});

document.getElementById('movement-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const itemName = document.getElementById('movement-item').value;
    const type = document.getElementById('movement-type').value;
    const quantity = parseFloat(document.getElementById('movement-quantity').value);
    const reason = document.getElementById('movement-reason').value.trim();

    if (itemName && quantity > 0 && reason) {
        await saveInventoryMovement({ itemName, type, quantity, reason });
        this.reset();
    } else {
        showNotification('Por favor, completa todos los campos correctamente.', 'error');
    }
});

document.getElementById('tool-movement-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const toolName = document.getElementById('tool-movement-item').value;
    const type = document.getElementById('tool-movement-type').value;
    const quantity = parseInt(document.getElementById('tool-movement-quantity').value);
    const reason = document.getElementById('tool-movement-reason').value.trim();

    if (toolName && quantity > 0 && reason) {
        await saveToolMovement({ toolName, type, quantity, reason });
        this.reset();
    } else {
        showNotification('Por favor, completa todos los campos correctamente.', 'error');
    }
});

// ==================== ACCIONES ====================
function deleteItem(id) {
    if (confirm('¿Confirmar eliminación de este insumo?')) {
        deleteInventoryItem(id);
    }
}

function editItem(id) {
    const item = inventory.find(i => i.id === id);
    if (item) {
        document.getElementById('item-name').value = item.name;
        document.getElementById('item-quantity').value = item.quantity;
        document.getElementById('item-unit').value = item.unit;
        document.getElementById('item-min').value = item.minStock;
        document.getElementById('item-name').focus();
    }
}

function deleteTool(id) {
    if (confirm('¿Confirmar eliminación de esta herramienta?')) {
        deleteToolItem(id);
    }
}

function editTool(id) {
    const tool = tools.find(t => t.id === id);
    if (tool) {
        document.getElementById('tool-name').value = tool.name;
        document.getElementById('tool-quantity').value = tool.quantity;
        document.getElementById('tool-category').value = tool.category;
        document.getElementById('tool-location').value = tool.location;
        document.getElementById('tool-name').focus();
    }
}

// ==================== NOTIFICACIONES ====================
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500'
    };

    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}