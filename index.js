document.addEventListener('DOMContentLoaded', async () => {
    const leaderboardBody = document.getElementById('leaderboard-body');
    const sectionFilter = document.getElementById('section-filter');
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    let data = [];
    let filteredData = [];
    let pinnedRows = [];

    const toggleVisibility = (element, show) => {
        element.classList.toggle('hidden', !show);
    };

    const populateSectionFilter = () => {
        const sections = [...new Set(data.map(student => student.section || 'N/A'))].sort();
        sectionFilter.innerHTML = '<option value="all">All Sections</option>';
        sections.forEach(section => {
            const option = document.createElement('option');
            option.value = section;
            option.textContent = section;
            sectionFilter.appendChild(option);
        });
    };

    const exportToCSV = (data) => {
        const headers = ['Rank', 'Roll Number', 'Name', 'Section', 'Total Solved', 'Easy', 'Medium', 'Hard', 'LeetCode URL'];
        const csvRows = data.map((student, index) => [
            index + 1,
            student.roll,
            student.name,
            student.section || 'N/A',
            student.totalSolved || 'N/A',
            student.easySolved || 'N/A',
            student.mediumSolved || 'N/A',
            student.hardSolved || 'N/A',
            student.url
        ].join(','));
        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'leaderboard.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const renderLeaderboard = (sortedData) => {
        leaderboardBody.innerHTML = '';
        pinnedRows.forEach(student => leaderboardBody.appendChild(createRow(student, true)));
        sortedData.forEach((student) => {
            if (!pinnedRows.includes(student)) {
                leaderboardBody.appendChild(createRow(student));
            }
        });
    };

    const createRow = (student, isPinned = false) => {
        const row = document.createElement('tr');
        row.classList.add('border-b', 'border-gray-700');
        row.innerHTML = `
            <td class="p-4">${isPinned ? 'Pinned' : ''}</td>
            <td class="p-4">${student.roll}</td>
            <td class="p-4">
                ${student.url?.startsWith('https://leetcode.com/u/') 
                    ? `<a href="${student.url}" target="_blank" class="text-blue-400">${student.name}</a>`
                    : `<div class="text-red-500">${student.name}</div>`}
            </td>
            <td class="p-4">${student.section || 'N/A'}</td>
            <td class="p-4">${student.totalSolved || 'N/A'}</td>
            <td class="p-4 text-green-400">${student.easySolved || 'N/A'}</td>
            <td class="p-4 text-yellow-400">${student.mediumSolved || 'N/A'}</td>
            <td class="p-4 text-red-400">${student.hardSolved || 'N/A'}</td>
            <td class="p-4">
                <button class="pin-btn text-blue-500">${isPinned ? 'Unpin' : 'Pin'}</button>
            </td>
        `;
        row.querySelector('.pin-btn').addEventListener('click', () => togglePinRow(student));
        return row;
    };

    const togglePinRow = (student) => {
        if (pinnedRows.includes(student)) {
            pinnedRows = pinnedRows.filter(p => p !== student);
        } else {
            pinnedRows.push(student);
        }
        renderLeaderboard(filteredData);
    };

    const filterData = (section) => {
        filteredData = section === 'all' ? [...data] : data.filter(student => (student.section || 'N/A') === section);
        renderLeaderboard(filteredData);
    };

    const sortData = (field, direction, isNumeric = false) => {
        filteredData.sort((a, b) => {
            const valA = a[field] || (isNumeric ? 0 : '');
            const valB = b[field] || (isNumeric ? 0 : '');
            return direction === 'desc'
                ? (isNumeric ? valB - valA : valB.localeCompare(valA))
                : (isNumeric ? valA - valB : valA.localeCompare(valB));
        });
        renderLeaderboard(filteredData);
    };

    try {
        toggleVisibility(loadingState, true);
        const response = await fetch("http://localhost:3001/data");
        data = await response.json();
        filteredData = [...data];
        toggleVisibility(loadingState, false);
        populateSectionFilter();
        renderLeaderboard(filteredData);
    } catch (error) {
        toggleVisibility(loadingState, false);
        toggleVisibility(errorState, true);
        console.error('Error fetching data:', error);
    }

    sectionFilter.addEventListener('change', (e) => filterData(e.target.value));
    document.getElementById('export-btn').addEventListener('click', () => exportToCSV(filteredData));
    document.getElementById('sort-section').addEventListener('click', () => sortData('section', 'asc'));
    document.getElementById('sort-total').addEventListener('click', () => sortData('totalSolved', 'desc', true));
    document.getElementById('sort-easy').addEventListener('click', () => sortData('easySolved', 'desc', true));
    document.getElementById('sort-medium').addEventListener('click', () => sortData('mediumSolved', 'desc', true));
    document.getElementById('sort-hard').addEventListener('click', () => sortData('hardSolved', 'desc', true));
});
