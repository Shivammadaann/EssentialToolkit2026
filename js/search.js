// Global search functionality
class GlobalSearch {
    constructor() {
        this.isOpen = false;
        this.results = [];
        this.selectedIndex = 0;
        this.init();
    }

    init() {
        // Create search modal
        const modal = document.createElement('div');
        modal.id = 'global-search';
        modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] hidden flex items-start justify-center pt-20 animate-fade-in';
        modal.innerHTML = `
            <div class="bg-light-card dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden animate-scale-in">
                <div class="p-4 border-b border-light-border dark:border-dark-border">
                    <div class="flex items-center gap-3">
                        <i data-lucide="search" class="w-5 h-5 text-gray-400"></i>
                        <input 
                            type="text" 
                            id="global-search-input" 
                            placeholder="Search across all apps..." 
                            class="flex-1 bg-transparent border-none outline-none text-lg"
                            autocomplete="off"
                        >
                        <kbd class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">ESC</kbd>
                    </div>
                </div>
                <div id="search-results" class="max-h-96 overflow-y-auto p-2"></div>
            </div>
        `;
        document.body.appendChild(modal);

        // Setup event listeners
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
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

        const input = document.getElementById('global-search-input');
        input.addEventListener('input', (e) => this.search(e.target.value));
        input.addEventListener('keydown', (e) => this.handleKeyboard(e));
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
        const modal = document.getElementById('global-search');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.getElementById('global-search-input').focus();
    }

    close() {
        this.isOpen = false;
        const modal = document.getElementById('global-search');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.getElementById('global-search-input').value = '';
        this.results = [];
        this.selectedIndex = 0;
    }

    search(query) {
        if (!query || query.length < 2) {
            this.results = [];
            this.render();
            return;
        }

        const lowerQuery = query.toLowerCase();
        this.results = [];

        // Get data from localStorage
        const data = JSON.parse(localStorage.getItem('toolkitData') || '{}');

        // Search notes
        if (data.notes) {
            data.notes.forEach(note => {
                if (note.title.toLowerCase().includes(lowerQuery) || 
                    note.content.toLowerCase().includes(lowerQuery)) {
                    this.results.push({
                        type: 'note',
                        icon: 'file-text',
                        title: note.title,
                        preview: this.stripHtml(note.content).substring(0, 100),
                        action: () => {
                            switchApp('notes');
                            setTimeout(() => selectNote(note.id), 100);
                        }
                    });
                }
            });
        }

        // Search contacts
        if (data.contacts) {
            data.contacts.forEach(contact => {
                if (contact.name.toLowerCase().includes(lowerQuery) ||
                    (contact.email && contact.email.toLowerCase().includes(lowerQuery)) ||
                    (contact.phone && contact.phone.includes(query))) {
                    this.results.push({
                        type: 'contact',
                        icon: 'user',
                        title: contact.name,
                        preview: contact.email || contact.phone || '',
                        action: () => {
                            switchApp('contacts');
                            setTimeout(() => selectContact(contact.id), 100);
                        }
                    });
                }
            });
        }

        // Search passwords
        if (data.passwords) {
            data.passwords.forEach(pwd => {
                if (pwd.service.toLowerCase().includes(lowerQuery) ||
                    pwd.username.toLowerCase().includes(lowerQuery)) {
                    this.results.push({
                        type: 'password',
                        icon: 'key',
                        title: pwd.service,
                        preview: pwd.username,
                        action: () => {
                            switchApp('passwords');
                        }
                    });
                }
            });
        }

        // Search URLs
        if (data.urls) {
            data.urls.forEach(url => {
                if (url.title.toLowerCase().includes(lowerQuery) ||
                    url.url.toLowerCase().includes(lowerQuery)) {
                    this.results.push({
                        type: 'url',
                        icon: 'link',
                        title: url.title,
                        preview: url.url,
                        action: () => {
                            switchApp('urls');
                        }
                    });
                }
            });
        }

        this.selectedIndex = 0;
        this.render();
    }

    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    handleKeyboard(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedIndex = Math.min(this.selectedIndex + 1, this.results.length - 1);
            this.render();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
            this.render();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (this.results[this.selectedIndex]) {
                this.execute(this.results[this.selectedIndex]);
            }
        }
    }

    render() {
        const container = document.getElementById('search-results');
        
        if (this.results.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-400 py-8">No results found</div>';
            return;
        }

        let html = '';
        this.results.forEach((result, idx) => {
            const isSelected = idx === this.selectedIndex;
            html += `
                <div 
                    class="search-result flex items-start gap-3 px-3 py-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-accent text-white' : 'hover:bg-light-hover dark:hover:bg-dark-hover'}"
                    onclick="window.globalSearch.execute(window.globalSearch.results[${idx}])"
                >
                    <i data-lucide="${result.icon}" class="w-5 h-5 mt-0.5 shrink-0"></i>
                    <div class="flex-1 min-w-0">
                        <div class="font-semibold truncate">${result.title}</div>
                        <div class="text-sm opacity-70 truncate">${result.preview}</div>
                        <div class="text-xs opacity-50 mt-1 capitalize">${result.type}</div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Scroll selected into view
        const selected = container.querySelector('.search-result.bg-accent');
        if (selected) selected.scrollIntoView({ block: 'nearest' });
    }

    execute(result) {
        this.close();
        result.action();
    }
}

// Export singleton instance
window.globalSearch = new GlobalSearch();
