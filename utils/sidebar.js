document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch session data
        const sessionResponse = await fetch('/api/sessions/info');
        const sessionData = await sessionResponse.json();

        if (!sessionData.role) {
            console.error('No role found in session data.');
            return;
        }

        console.log('Session data:', sessionData); // Debugging

        // Fetch links based on role
        const response = await fetch('/api/links');
        if (!response.ok) throw new Error('Failed to fetch sidebar links');
        const links = await response.json();

        // Generate the sidebar HTML
        const sidebarHTML = links.map(link => `
            <li>
                <a href="${link.url}" class="d-flex align-items-center ${link.subItems ? 'toggle' : ''}">
                    <i class="${link.icon} me-2"></i> ${link.name}
                    ${link.subItems ? '<span class="ms-auto toggle-arrow">+</span>' : ''}
                </a>
                ${link.subItems ? `
                    <ul class="list-unstyled ms-4 collapsed">
                        ${link.subItems.map(subItem => `
                            <li><a href="${subItem.url}">${subItem.name}</a></li>
                        `).join('')}
                    </ul>
                ` : ''}
            </li>
        `).join('');

        const sidebar = document.getElementById('sidebar');
        sidebar.innerHTML = `<ul class="list-unstyled p-3">${sidebarHTML}</ul>`;

        // Collapse all submenus on load
        document.querySelectorAll('.toggle').forEach(item => {
            const subMenu = item.nextElementSibling; // Find submenu
            const isActive = window.location.href.includes(item.getAttribute('href')); // Check if menu is active

            if (subMenu) {
                if (isActive) {
                    subMenu.classList.remove('collapsed'); // Keep active menu expanded
                    subMenu.style.display = 'block'; // Make visible
                } else {
                    subMenu.classList.add('collapsed'); // Collapse other menus
                    subMenu.style.display = 'none'; // Hide other menus
                }
            }
        });

        // Add toggle functionality for user interaction
        document.querySelectorAll('.toggle').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const subMenu = item.nextElementSibling;
                if (subMenu) {
                    const isCollapsed = subMenu.classList.toggle('collapsed'); // Toggle class
                    subMenu.style.display = isCollapsed ? 'none' : 'block'; // Toggle visibility
                    const arrow = item.querySelector('.toggle-arrow');
                    if (arrow) {
                        arrow.textContent = isCollapsed ? '+' : '-'; // Update toggle icon
                    }
                }
            });
        });

    } catch (error) {
        console.error('Error handling sidebar menu:', error);
    }
});
