document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch("http://localhost:3001/data");
        const data = await response.json();
        let filteredData = [...data]; // Keep original data separate
        let pinnedUsers = [];

        const leaderboardBody = document.getElementById('leaderboard-body');
        const sectionFilter = document.getElementById('section-filter');

        // Populate section filter dropdown
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

        // Function to export data to CSV
        const exportToCSV = (data) => {
            const headers = ['Rank', 'Roll Number', 'Name', 'Section', 'Total Solved', 'Easy', 'Medium', 'Hard', 'LeetCode URL'];
            const csvRows = data.map((student, index) => {
                return [
                    index + 1,
                    student.roll,
                    student.name,
                    student.section || 'N/A',
                    student.totalSolved || 'N/A',
                    student.easySolved || 'N/A',
                    student.mediumSolved || 'N/A',
                    student.hardSolved || 'N/A',
                    student.url
                ].join(',');
            });

            const csvContent = [headers.join(','), ...csvRows].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'leaderboard.csv');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        // Function to render the leaderboard
        const renderLeaderboard = (sortedData) => {
            leaderboardBody.innerHTML = '';

            // Get the top 3 students
            const top3 = sortedData.slice(0, 3); // Get the first 3 sorted students

            sortedData.forEach((student, index) => {
                const row = document.createElement('tr');
                row.classList.add('border-b', 'border-gray-700');

                // Check if the student is in the top 3
                const isTop3 = top3.includes(student);
                const studentName = isTop3
                    ? `<span style="color: #FFD700;">${student.name} 🏆</span>`  // Golden color and award emoji for top 3
                    : student.name;

                row.innerHTML = `
                    <td class="p-4">${index + 1}</td>
                    <td class="p-4">${student.roll}</td>
                    <td class="p-4">
                        <button class="text-blue-400" data-roll="${student.roll}">
                            ${studentName} ${pinnedUsers.includes(student.roll) ? '📌' : ''}
                        </button>
                    </td>
                    <td class="p-4">${student.section || 'N/A'}</td>
                    <td class="p-4">${student.totalSolved || 'N/A'}</td>
                    <td class="p-4 text-green-400">${student.easySolved || 'N/A'}</td>
                    <td class="p-4 text-yellow-400">${student.mediumSolved || 'N/A'}</td>
                    <td class="p-4 text-red-400">${student.hardSolved || 'N/A'}</td>
                `;
                leaderboardBody.appendChild(row);
            });
        }; 

        // Filter function
        const filterData = (section) => {
            filteredData = section === 'all'
                ? [...data]
                : data.filter(student => (student.section || 'N/A') === section);
            renderLeaderboard(filteredData);
        };

        // Sorting logic with ascending and descending functionality
        const sortData = (data, field, direction, isNumeric = false) => {
            return data.sort((a, b) => {
                const valA = a[field] || (isNumeric ? 0 : 'Z');
                const valB = b[field] || (isNumeric ? 0 : 'Z');
                if (isNumeric) {
                    return direction === 'desc' ? valB - valA : valA - valB;
                } else {
                    return direction === 'desc'
                        ? valB.toString().localeCompare(valA.toString())
                        : valA.toString().localeCompare(valB.toString());
                }
            });
        };

        // Pin a user to the top by clicking on their name
        leaderboardBody.addEventListener('click', (event) => {
            if (event.target.tagName === 'BUTTON' && event.target.dataset.roll) {
                const rollNumber = event.target.dataset.roll;

                if (pinnedUsers.includes(rollNumber)) {
                    // Unpin the user
                    pinnedUsers = pinnedUsers.filter(roll => roll !== rollNumber);
                } else {
                    // Pin the user
                    pinnedUsers.push(rollNumber);
                }

                // Re-sort the data, with pinned users at the top
                const sortedData = [...filteredData].sort((a, b) => {
                    if (pinnedUsers.includes(a.roll) && !pinnedUsers.includes(b.roll)) {
                        return -1;
                    } else if (!pinnedUsers.includes(a.roll) && pinnedUsers.includes(b.roll)) {
                        return 1;
                    }
                    return b.totalSolved - a.totalSolved; // Sort by total solved
                });

                renderLeaderboard(sortedData);
            }
        });

        // Initialize the page
        populateSectionFilter();
        renderLeaderboard(data);

        // Event Listeners
        sectionFilter.addEventListener('change', (e) => {
            filterData(e.target.value);
        });

        document.getElementById('export-btn').addEventListener('click', () => {
            exportToCSV(filteredData); // Export only filtered data
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
