// Data Storage (using localStorage)
const STORAGE_KEY = 'campus_lost_found_items';

// Initialize data
let items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// DOM Elements
const reportFormSection = document.getElementById('report-form');
const formTitle = document.getElementById('form-title');
const itemForm = document.getElementById('itemForm');
const itemTypeInput = document.getElementById('itemType');
const itemsList = document.getElementById('itemsList');
const searchInput = document.getElementById('searchInput');
const filterType = document.getElementById('filterType');
const totalCount = document.getElementById('totalCount');
const lostCount = document.getElementById('lostCount');
const foundCount = document.getElementById('foundCount');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    displayItems(items);
});

// Form Display Functions
function showReportForm(type) {
    itemTypeInput.value = type;
    formTitle.textContent = `Report ${type.charAt(0).toUpperCase() + type.slice(1)} Item`;
    reportFormSection.style.display = 'block';
    
    // Scroll to form
    reportFormSection.scrollIntoView({ behavior: 'smooth' });
    
    // Reset form
    itemForm.reset();
    document.getElementById('itemId').value = '';
    document.getElementById('date').valueAsDate = new Date();
}

function hideForm() {
    reportFormSection.style.display = 'none';
}

// Form Submission
itemForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const itemId = document.getElementById('itemId').value;
    const isEdit = itemId !== '';
    
    const newItem = {
        id: isEdit ? parseInt(itemId) : Date.now(),
        type: itemTypeInput.value,
        name: document.getElementById('itemName').value,
        location: document.getElementById('location').value,
        date: document.getElementById('date').value,
        description: document.getElementById('description').value,
        contact: document.getElementById('contact').value,
        status: 'open',
        timestamp: new Date().toISOString()
    };
    
    if (isEdit) {
        // Update existing item
        const index = items.findIndex(item => item.id === parseInt(itemId));
        if (index !== -1) {
            items[index] = newItem;
        }
    } else {
        // Add new item
        items.push(newItem);
    }
    
    // Save to localStorage
    saveData();
    
    // Update display
    displayItems(items);
    updateStats();
    
    // Reset and hide form
    hideForm();
    
    // Show success message
    alert(`Item ${isEdit ? 'updated' : 'reported'} successfully!`);
});

// Display Items
function displayItems(itemsToDisplay) {
    if (itemsToDisplay.length === 0) {
        itemsList.innerHTML = '<p class="empty-message">No items found. Try a different search or be the first to report!</p>';
        return;
    }
    
    itemsList.innerHTML = itemsToDisplay.map(item => `
        <div class="item-card ${item.type}">
            <div class="item-header">
                <h3>${item.name}</h3>
                <span class="item-type ${item.type}">${item.type.toUpperCase()}</span>
            </div>
            <div class="item-details">
                <p><i class="fas fa-map-marker-alt"></i> ${item.location}</p>
                <p><i class="fas fa-calendar-alt"></i> ${formatDate(item.date)}</p>
                <p><i class="fas fa-align-left"></i> ${item.description}</p>
                <p><i class="fas fa-user"></i> Contact: ${item.contact}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-small" onclick="editItem(${item.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-small btn-danger" onclick="deleteItem(${item.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Search Function
function searchItems() {
    const query = searchInput.value.toLowerCase().trim();
    const typeFilter = filterType.value;
    
    let filteredItems = items;
    
    // Filter by type
    if (typeFilter !== 'all') {
        filteredItems = filteredItems.filter(item => item.type === typeFilter);
    }
    
    // Filter by search query
    if (query) {
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(query) ||
            item.location.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query)
        );
    }
    
    displayItems(filteredItems);
}

function filterItems() {
    searchItems();
}

// Edit Item
function editItem(id) {
    const item = items.find(item => item.id === id);
    if (item) {
        showReportForm(item.type);
        document.getElementById('itemId').value = item.id;
        document.getElementById('itemName').value = item.name;
        document.getElementById('location').value = item.location;
        document.getElementById('date').value = item.date;
        document.getElementById('description').value = item.description;
        document.getElementById('contact').value = item.contact;
    }
}

// Delete Item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        items = items.filter(item => item.id !== id);
        saveData();
        displayItems(items);
        updateStats();
    }
}

// Update Statistics
function updateStats() {
    totalCount.textContent = items.length;
    lostCount.textContent = items.filter(item => item.type === 'lost').length;
    foundCount.textContent = items.filter(item => item.type === 'found').length;
}

// Save Data
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Add sample data button (for demo purposes)
function addSampleData() {
    if (items.length > 0 && !confirm('This will add sample data. Continue?')) return;
    
    const sampleItems = [
        {
            id: 1,
            type: 'lost',
            name: 'Student ID Card',
            location: 'Library Ground Floor',
            date: '2023-10-15',
            description: 'Blue cover, 2024 batch, photo visible',
            contact: 'student1@campus.edu',
            status: 'open',
            timestamp: new Date().toISOString()
        },
        {
            id: 2,
            type: 'found',
            name: 'Blue Water Bottle',
            location: 'Cafeteria',
            date: '2023-10-16',
            description: 'Metal, 1L capacity, with stickers',
            contact: 'finder@campus.edu',
            status: 'open',
            timestamp: new Date().toISOString()
        },
        {
            id: 3,
            type: 'lost',
            name: 'Calculator',
            location: 'Math Building Room 302',
            date: '2023-10-14',
            description: 'Casio fx-991EX, black, in blue case',
            contact: 'mathstudent@campus.edu',
            status: 'open',
            timestamp: new Date().toISOString()
        }
    ];
    
    items = [...sampleItems, ...items.filter(item => item.id > 3)];
    saveData();
    displayItems(items);
    updateStats();
    
    alert('Sample data added!');
}

// Make function available globally
window.addSampleData = addSampleData;