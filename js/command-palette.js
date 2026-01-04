// Command Palette for quick navigation and actions
class CommandPalette {
    constructor() {
        this.isOpen = false;
        this.commands = [];
        this.filteredCommands = [];
        this.selectedIndex = 0;
        this.init();
    }

    init() {
        // Create modal
        const modal = document.createElement('div');
        modal.id = 'command-palette';
        modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] hidden flex items-start justify-center pt-20 animate-fade-in';
        modal.innerHTML = `
            <div class="bg-light-card dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-scale-in">
                <div class="p-4 border-b border-light-border dark:border-dark-border">
                    <div class="flex items-center gap-3">
                        <i data-lucide="search" class="w-5 h-5 text-gray-400"></i>
                        <input 
                            type="text" 
                            id="command-input" 
                            placeholder="Type a command or search..." 
                            class="flex-1 bg-transparent border-none outline-none text-lg"
                            autocomplete="off"
                        >
                        <kbd class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">ESC</kbd>
                    </div>
                </div>
                <div id="command-list" class="max-h-96 overflow-y-auto p-2"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // Setup event listeners
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });

        const input = document.getElementById('command-input');
        input.addEventListener('input', (e) => this.handleSearch(e.target.value));
        input.addEventListener('keydown', (e) => this.handleKeyboard(e));

        this.registerDefaultCommands();
    }

    registerDefaultCommands() {
        this.commands = [
            // Navigation
            { id: 'nav-home', name: 'Go to Home', icon: 'home', action: () => switchApp('home'), category: 'Navigation' },
            { id: 'nav-notes', name: 'Go to Notes', icon: 'file-text', action: () => switchApp('notes'), category: 'Navigation' },
            { id: 'nav-photos', name: 'Go to Photos', icon: 'image', action: () => switchApp('photos'), category: 'Navigation' },
            { id: 'nav-passwords', name: 'Go to Passwords', icon: 'key', action: () => switchApp('passwords'), category: 'Navigation' },
            { id: 'nav-contacts', name: 'Go to Contacts', icon: 'users', action: () => switchApp('contacts'), category: 'Navigation' },
            { id: 'nav-urls', name: 'Go to URLs', icon: 'link', action: () => switchApp('urls'), category: 'Navigation' },
            { id: 'nav-settings', name: 'Go to Settings', icon: 'settings', action: () => switchApp('settings'), category: 'Navigation' },
            { id: 'nav-profile', name: 'Go to Profile', icon: 'user', action: () => switchApp('profile'), category: 'Navigation' },
            
            // Actions
            { id: 'new-note', name: 'Create New Note', icon: 'file-plus', action: () => { switchApp('notes'); setTimeout(createNote, 100); }, category: 'Actions' },
            { id: 'new-contact', name: 'Add New Contact', icon: 'user-plus', action: () => { switchApp('contacts'); setTimeout(openContactModal, 100); }, category: 'Actions' },
            { id: 'new-password', name: 'Add New Password', icon: 'key', action: () => { switchApp('passwords'); setTimeout(openPasswordModal, 100); }, category: 'Actions' },
            { id: 'new-url', name: 'Add New URL', icon: 'link', action: () => { switchApp('urls'); setTimeout(openUrlModal, 100); }, category: 'Actions' },
            { id: 'upload-photo', name: 'Upload Photos', icon: 'upload', action: () => { switchApp('photos'); setTimeout(() => document.getElementById('photo-input').click(), 100); }, category: 'Actions' },
            
            // Theme
            { id: 'theme-dark', name: 'Switch to Dark Theme', icon: 'moon', action: () => setTheme('dark'), category: 'Theme' },
            { id: 'theme-light', name: 'Switch to Light Theme', icon: 'sun', action: () => setTheme('light'), category: 'Theme' },
            { id: 'theme-auto', name: 'Auto Theme', icon: 'monitor', action: () => setTheme('auto'), category: 'Theme' },
            
            // Data
            { id: 'export-data', name: 'Export All Data', icon: 'download', action: () => this.exportData(), category: 'Data' },
            { id: 'import-data', name: 'Import Data', icon: 'upload', action: () => this.importData(), category: 'Data' },
            { id: 'clear-data', name: 'Clear All Data', icon: 'trash-2', action: () => this.clearData(), category: 'Data' },
        ];
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        const modal = document.getElementById('command-palette');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.getElementById('command-input').focus();
        this.handleSearch('');
    }

    close() {
        this.isOpen = false;
        const modal = document.getElementById('command-palette');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.getElementById('command-input').value = '';
        this.selectedIndex = 0;
    }

    handleSearch(query) {
        const lowerQuery = query.toLowerCase();
        this.filteredCommands = this.commands.filter(cmd => 
            cmd.name.toLowerCase().includes(lowerQuery) ||
            cmd.category.toLowerCase().includes(lowerQuery)
        );
        this.selectedIndex = 0;
        this.render();
    }

    handleKeyboard(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredCommands.length - 1);
            this.render();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
            this.render();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.filteredCommands[this.selectedIndex]) {
                this.execute(this.filteredCommands[this.selectedIndex]);
            }
        }
    }

    render() {
        const list = document.getElementById('command-list');
        if (this.filteredCommands.length === 0) {
            list.innerHTML = '<div class="text-center text-gray-400 py-8">No commands found</div>';
            return;
        }

        // Group by category
        const grouped = {};
        this.filteredCommands.forEach(cmd => {
            if (!grouped[cmd.category]) grouped[cmd.category] = [];
            grouped[cmd.category].push(cmd);
        });

        let html = '';
        Object.entries(grouped).forEach(([category, commands]) => {
            html += `<div class="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">${category}</div>`;
            commands.forEach((cmd, idx) => {
                const globalIdx = this.filteredCommands.indexOf(cmd);
                const isSelected = globalIdx === this.selectedIndex;
                html += `
                    <div 
                        class="command-item flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-accent text-white' : 'hover:bg-light-hover dark:hover:bg-dark-hover'}"
                        onclick="window.commandPalette.execute(window.commandPalette.filteredCommands[${globalIdx}])"
                    >
                        <i data-lucide="${cmd.icon}" class="w-5 h-5"></i>
                        <span class="flex-1">${cmd.name}</span>
                    </div>
                `;
            });
        });

        list.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Scroll selected into view
        const selected = list.querySelector('.command-item.bg-accent');
        if (selected) selected.scrollIntoView({ block: 'nearest' });
    }

    execute(command) {
        this.close();
        command.action();
        toast.success(`Executed: ${command.name}`);
    }

    // Data management commands
    exportData() {
        const data = localStorage.getItem('toolkitData');
        if (!data) {
            toast.error('No data to export');
            return;
        }

        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `toolkit-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Data exported successfully');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    localStorage.setItem('toolkitData', JSON.stringify(data));
                    toast.success('Data imported successfully. Reloading...');
                    setTimeout(() => location.reload(), 1000);
                } catch (err) {
                    toast.error('Invalid backup file');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    clearData() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone!')) {
            localStorage.clear();
            toast.success('All data cleared. Reloading...');
            setTimeout(() => location.reload(), 1000);
        }
    }
}

// Export singleton instance
window.commandPalette = new CommandPalette();
