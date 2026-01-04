// Keyboard shortcuts manager
class KeyboardShortcuts {
    constructor() {
        this.shortcuts = new Map();
        this.isModalOpen = false;
        this.init();
        this.registerDefaultShortcuts();
    }

    init() {
        // Create shortcuts help modal
        const modal = document.createElement('div');
        modal.id = 'shortcuts-modal';
        modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] hidden flex items-center justify-center p-4 animate-fade-in';
        modal.innerHTML = `
            <div class="bg-light-card dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
                <div class="p-6 border-b border-light-border dark:border-dark-border flex items-center justify-between">
                    <h2 class="text-2xl font-bold">Keyboard Shortcuts</h2>
                    <button onclick="window.keyboardShortcuts.closeModal()" class="p-2 hover:bg-light-hover dark:hover:bg-dark-hover rounded-lg">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                <div id="shortcuts-list" class="p-6 max-h-[60vh] overflow-y-auto"></div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        // Listen for ? key to show shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === '?' && !this.isModalOpen) {
                e.preventDefault();
                this.showModal();
            }
            if (e.key === 'Escape' && this.isModalOpen) {
                this.closeModal();
            }
        });
    }

    registerDefaultShortcuts() {
        // Navigation shortcuts
        this.register('Ctrl+1', () => switchApp('home'), 'Go to Home', 'Navigation');
        this.register('Ctrl+2', () => switchApp('notes'), 'Go to Notes', 'Navigation');
        this.register('Ctrl+3', () => switchApp('photos'), 'Go to Photos', 'Navigation');
        this.register('Ctrl+4', () => switchApp('passwords'), 'Go to Passwords', 'Navigation');
        this.register('Ctrl+5', () => switchApp('contacts'), 'Go to Contacts', 'Navigation');
        this.register('Ctrl+6', () => switchApp('urls'), 'Go to URLs', 'Navigation');
        this.register('Ctrl+7', () => switchApp('settings'), 'Go to Settings', 'Navigation');
        this.register('Ctrl+8', () => switchApp('profile'), 'Go to Profile', 'Navigation');

        // Global shortcuts
        this.register('Ctrl+K', () => window.commandPalette.toggle(), 'Open Command Palette', 'Global');
        this.register('Ctrl+F', () => window.globalSearch.toggle(), 'Global Search', 'Global');
        this.register('?', () => this.showModal(), 'Show Keyboard Shortcuts', 'Global');
        this.register('Ctrl+/', () => toggleTheme(), 'Toggle Theme', 'Global');

        // Action shortcuts
        this.register('Ctrl+N', () => { 
            if (currentApp === 'notes') createNote();
            else if (currentApp === 'contacts') openContactModal();
            else if (currentApp === 'passwords') openPasswordModal();
            else if (currentApp === 'urls') openUrlModal();
        }, 'New Item (context-aware)', 'Actions');

        // Setup keyboard listener
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    register(key, action, description, category = 'General') {
        const normalizedKey = this.normalizeKey(key);
        this.shortcuts.set(normalizedKey, { action, description, category, key });
    }

    normalizeKey(key) {
        return key.toLowerCase()
            .replace('cmd', 'ctrl')
            .replace('command', 'ctrl')
            .replace('meta', 'ctrl');
    }

    handleKeyPress(e) {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || 
            e.target.tagName === 'TEXTAREA' || 
            e.target.isContentEditable) {
            return;
        }

        let key = '';
        if (e.ctrlKey || e.metaKey) key += 'ctrl+';
        if (e.altKey) key += 'alt+';
        if (e.shiftKey && e.key.length > 1) key += 'shift+';
        key += e.key.toLowerCase();

        const shortcut = this.shortcuts.get(key);
        if (shortcut) {
            e.preventDefault();
            shortcut.action();
        }
    }

    showModal() {
        this.isModalOpen = true;
        const modal = document.getElementById('shortcuts-modal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        this.renderShortcuts();
    }

    closeModal() {
        this.isModalOpen = false;
        const modal = document.getElementById('shortcuts-modal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    renderShortcuts() {
        const container = document.getElementById('shortcuts-list');
        
        // Group by category
        const grouped = {};
        this.shortcuts.forEach(shortcut => {
            if (!grouped[shortcut.category]) grouped[shortcut.category] = [];
            grouped[shortcut.category].push(shortcut);
        });

        let html = '';
        Object.entries(grouped).forEach(([category, shortcuts]) => {
            html += `
                <div class="mb-6">
                    <h3 class="text-sm font-semibold text-gray-500 uppercase mb-3">${category}</h3>
                    <div class="space-y-2">
            `;
            shortcuts.forEach(shortcut => {
                const keys = shortcut.key.split('+').map(k => 
                    `<kbd class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded font-mono">${k.toUpperCase()}</kbd>`
                ).join('<span class="mx-1 text-gray-400">+</span>');
                
                html += `
                    <div class="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover">
                        <span class="text-sm">${shortcut.description}</span>
                        <div class="flex items-center gap-1">${keys}</div>
                    </div>
                `;
            });
            html += `
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

// Export singleton instance
window.keyboardShortcuts = new KeyboardShortcuts();
