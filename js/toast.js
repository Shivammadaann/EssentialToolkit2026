// Toast notification system
class ToastManager {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none';
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `pointer-events-auto bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-slide-in max-w-sm`;

        const icons = {
            success: '<i data-lucide="check-circle" class="w-5 h-5 text-green-500"></i>',
            error: '<i data-lucide="x-circle" class="w-5 h-5 text-red-500"></i>',
            warning: '<i data-lucide="alert-triangle" class="w-5 h-5 text-yellow-500"></i>',
            info: '<i data-lucide="info" class="w-5 h-5 text-blue-500"></i>'
        };

        toast.innerHTML = `
            ${icons[type] || icons.info}
            <span class="flex-1 text-sm font-medium">${message}</span>
            <button onclick="this.parentElement.remove()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        `;

        this.container.appendChild(toast);
        if (typeof lucide !== 'undefined') lucide.createIcons();

        if (duration > 0) {
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Export singleton instance
window.toast = new ToastManager();
