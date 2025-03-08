// Tool Categories Data
const toolCategories = [
    {
        name: 'Image Tools',
        icon: 'fa-image',
        tools: ['Image to PNG Converter', 'Image to JPG Converter', 'Image Resizer', 'Image Compressor']
    },
    {
        name: 'SEO Tools',
        icon: 'fa-search',
        tools: ['Meta Tag Generator', 'Keyword Density Checker', 'Sitemap Generator', 'Robots.txt Generator']
    },
    {
        name: 'Text Tools',
        icon: 'fa-font',
        tools: ['Word Counter', 'Character Counter', 'Case Converter', 'Plagiarism Checker']
    },
    {
        name: 'Developer Tools',
        icon: 'fa-code',
        tools: ['JSON Formatter', 'HTML to Markdown', 'CSS Minifier', 'JavaScript Minifier']
    },
    {
        name: 'Calculators',
        icon: 'fa-calculator',
        tools: ['Percentage Calculator', 'Age Calculator', 'BMI Calculator', 'Loan EMI Calculator']
    },
    {
        name: 'Converters',
        icon: 'fa-exchange-alt',
        tools: ['Length Converter', 'Weight Converter', 'Speed Converter', 'Temperature Converter']
    }
];

// Load Header and Footer
document.addEventListener('DOMContentLoaded', function() {
    // Load Header
    fetch('./components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Initialize Bootstrap components after loading
            initializeBootstrapComponents();
            // Update header links to use relative paths
            updateHeaderLinks();
        });

    // Load Footer
    fetch('./components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            // Update footer links to use relative paths
            updateFooterLinks();
        });

    // Initialize categories if on home page
    if (document.getElementById('categories-container')) {
        initializeCategories();
    }

    // Initialize search functionality
    initializeSearch();
});

// Update header links to use relative paths
function updateHeaderLinks() {
    const navLinks = document.querySelectorAll('#navbarNav a.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('/')) {
            link.setAttribute('href', '.' + link.getAttribute('href'));
        }
    });
}

// Update footer links to use relative paths
function updateFooterLinks() {
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('/')) {
            link.setAttribute('href', '.' + link.getAttribute('href'));
        }
    });
}

// Initialize Bootstrap Components
function initializeBootstrapComponents() {
    // Initialize all dropdowns
    var dropdowns = document.querySelectorAll('.dropdown-toggle');
    dropdowns.forEach(dropdown => {
        new bootstrap.Dropdown(dropdown);
    });
}

// Initialize Categories
function initializeCategories() {
    const categoriesContainer = document.getElementById('categories-container');
    
    toolCategories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'col-md-4 mb-4';
        categoryElement.innerHTML = `
            <div class="category-card">
                <i class="fas ${category.icon} category-icon"></i>
                <h3>${category.name}</h3>
                <p>${category.tools.length} tools</p>
                <a href="./tools/${category.name.toLowerCase().replace(/\s+/g, '-')}" class="btn btn-primary">
                    View Tools
                </a>
            </div>
        `;
        categoriesContainer.appendChild(categoryElement);
    });
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('toolSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase();
        searchTools(searchTerm);
    }, 300));
}

// Search Tools
function searchTools(searchTerm) {
    const featuredToolsContainer = document.getElementById('featured-tools-container');
    if (!featuredToolsContainer) return;

    // Clear previous results
    featuredToolsContainer.innerHTML = '';

    // Flatten all tools into a single array
    const allTools = toolCategories.reduce((acc, category) => {
        return acc.concat(category.tools.map(tool => ({
            name: tool,
            category: category.name
        })));
    }, []);

    // Filter tools based on search term
    const filteredTools = allTools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.category.toLowerCase().includes(searchTerm)
    );

    // Display results
    filteredTools.forEach(tool => {
        const toolElement = document.createElement('div');
        toolElement.className = 'col-md-4 mb-4';
        toolElement.innerHTML = `
            <div class="tool-card">
                <div class="card-body">
                    <h5 class="card-title">${tool.name}</h5>
                    <p class="card-text">Category: ${tool.category}</p>
                    <a href="./tools/${tool.name.toLowerCase().replace(/\s+/g, '-')}" class="btn btn-primary">
                        Use Tool
                    </a>
                </div>
            </div>
        `;
        featuredToolsContainer.appendChild(toolElement);
    });

    // Show message if no results found
    if (filteredTools.length === 0) {
        featuredToolsContainer.innerHTML = `
            <div class="col-12 text-center">
                <p>No tools found matching "${searchTerm}"</p>
            </div>
        `;
    }
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility function to create URL-friendly slugs
function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
}

// Add to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(
        function() {
            // Show success message
            const tooltip = bootstrap.Tooltip.getInstance('#copyButton');
            if (tooltip) {
                tooltip.setContent({ '.tooltip-inner': 'Copied!' });
                setTimeout(() => {
                    tooltip.setContent({ '.tooltip-inner': 'Copy to clipboard' });
                }, 2000);
            }
        }
    ).catch(
        function(err) {
            console.error('Could not copy text: ', err);
        }
    );
} 