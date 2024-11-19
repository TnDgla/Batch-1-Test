const compareUsers = (user1, user2) => {
    fetch("data.json")
        .then((response) => response.json())
        .then((data) => {
            const user1Data = data.find((user) => user.roll === user1);
            const user2Data = data.find((user) => user.roll === user2);

            if (user1Data && user2Data) {
                const comparisonResult = document.getElementById("comparison-result");
                comparisonResult.innerHTML = "Result";

                const totalSolved1 = user1Data.totalSolved;
                const totalSolved2 = user2Data.totalSolved;
                const easySolved1 = user1Data.easySolved;
                const easySolved2 = user2Data.easySolved;
                const mediumSolved1 = user1Data.mediumSolved;
                const mediumSolved2 = user2Data.mediumSolved;
                const hardSolved1 = user1Data.hardSolved;
                const hardSolved2 = user2Data.hardSolved;

                comparisonResult.innerHTML += `<p class="text-lg">Total: ${user1Data.name} - ${totalSolved1}, ${user2Data.name} - ${totalSolved2}</p>`;
                comparisonResult.innerHTML += `<p class="text-lg">Easy: ${user1Data.name} - ${easySolved1}, ${user2Data.name} - ${easySolved2}</p>`;
                comparisonResult.innerHTML += `<p class="text-lg">Medium: ${user1Data.name} - ${mediumSolved1}, ${user2Data.name} - ${mediumSolved2}</p>`;
                comparisonResult.innerHTML += `<p class="text-lg">Hard: ${user1Data.name} - ${hardSolved1}, ${user2Data.name} - ${hardSolved2}</p>`;

                if (totalSolved1 > totalSolved2) {
                    comparisonResult.innerHTML += `<p class="text-lg">Total: ${user1Data.name} > ${user2Data.name}</p>`;
                } else if (totalSolved1 < totalSolved2) {
                    comparisonResult.innerHTML += `<p class="text-lg">Total: ${user2Data.name} > ${user1Data.name}</p>`;
                } else {
                    comparisonResult.innerHTML += `<p class="text-lg">Total: ${user1Data.name} = ${user2Data.name}</p>`;
                }

                if (easySolved1 > easySolved2) {
                    comparisonResult.innerHTML += `<p class="text-lg">Easy: ${user1Data.name} > ${user2Data.name}</p>`;
                } else if (easySolved1 < easySolved2) {
                    comparisonResult.innerHTML += `<p class="text-lg">Easy: ${user2Data.name} > ${user1Data.name}</p>`;
                } else {
                    comparisonResult.innerHTML += `<p class="text-lg">Easy: ${user1Data.name} = ${user2Data.name}</p>`;
                }

                if (mediumSolved1 > mediumSolved2) {
                    comparisonResult.innerHTML += `<p class="text-lg">Medium: ${user1Data.name} > ${user2Data.name}</p>`;
                } else if (mediumSolved1 < mediumSolved2) {
                    comparisonResult.innerHTML += `<p class="text-lg">Medium: ${user2Data.name} > ${user1Data.name}</p>`;
                } else {
                    comparisonResult.innerHTML += `<p class="text-lg">Medium: ${user1Data.name} = ${user2Data.name}</p>`;
                }

                if (hardSolved1 > hardSolved2) {
                    comparisonResult.innerHTML += `<p class="text-lg">Hard: ${user1Data.name} > ${user2Data.name}</p>`;
                } else if (hardSolved1 < hardSolved2) {
                    comparisonResult.innerHTML += `<p class="text-lg">Hard: ${user2Data.name} > ${user1Data.name}</p>`;
                } else {
                    comparisonResult.innerHTML += `<p class="text-lg">Hard: ${user1Data.name} = ${user2Data.name}</p>`;
                }
            } else {
                comparisonResult.innerHTML = "User not found";
            }
        })
        .catch((error) => console.error(error));
}


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch("http://localhost:3001/data");
        const data = await response.json();
        console.log(data)
        let filteredData = [...data]; // Keep original data separate
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


        const renderLeaderboard = (sortedData, pinnedRows = []) => {
            leaderboardBody.innerHTML = '';
            const pinnedRowsHtml = pinnedRows.map((student, index) => {
                const row = document.createElement('tr');
                row.classList.add('border-b', 'border-gray-700', 'pinned-row');
                row.innerHTML = `
            <td class="p-4">${index + 1}</td>
            <td class="p-4">${student.roll}</td>
            <td class="p-4">
                ${student.url.startsWith('https://leetcode.com/u/')
                        ? `<a href="${student.url}" target="_blank" class="text-blue-400">${student.name}</a>`
                        : `<div class="text-red-500">${student.name}</div>`}
            </td>
            <td class="p-4">${student.section || 'N/A'}</td>
            <td class="p-4">${student.totalSolved || 'N/A'}</td>
            <td class="p-4 text-green-400">${student.easySolved || 'N/A'}</td>
            <td class="p-4 text-yellow-400">${student.mediumSolved || 'N/A'}</td>
            <td class="p-4 text-red-400">${student.hardSolved || 'N/A'}</td>
            <td class="p-4"><button class="pin-btn">Unpin</button></td>
        `;
                return row;
            });
            const rowsHtml = sortedData.map((student, index) => {
                const row = document.createElement('tr');
                row.classList.add('border-b', 'border-gray-700');
                row.innerHTML = `
            <td class="p-4">${index + 1 + pinnedRows.length}</td>
            <td class="p-4">${student.roll}</td>
            <td class="p-4">
                ${student.url.startsWith('https://leetcode.com/u/')
                        ? `<a href="${student.url}" target="_blank" class="text-blue-400">${student.name}</a>`
                        : `<div class="text-red-500">${student.name}</div>`}
            </td>
            <td class="p-4">${student.section || 'N/A'}</td>
            <td class="p-4">${student.totalSolved || 'N/A'}</td>
            <td class="p-4 text-green-400">${student.easySolved || 'N/A'}</td>
            <td class="p-4 text-yellow-400">${student.mediumSolved || 'N/A'}</td>
            <td class="p-4 text-red-400">${student.hardSolved || 'N/A'}</td>
            <td class="p-4"><button class="pin-btn">Pin</button></td>
        `;
                return row;
            });
            leaderboardBody.append(...pinnedRowsHtml, ...rowsHtml);

            const pinBtns = document.querySelectorAll('.pin-btn');
            pinBtns.forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    const row = e.target.parentNode.parentNode;
                    const student = sortedData.find((student) => student.roll === row.cells[1].textContent);
                    if (btn.textContent === 'Pin') {
                        pinnedRows.push(student);
                        renderLeaderboard(sortedData, pinnedRows);
                    } else {
                        pinnedRows = pinnedRows.filter((student) => student.roll !== row.cells[1].textContent);
                        renderLeaderboard(sortedData, pinnedRows);
                    }
                });
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
        let totalSolvedDirection = 'desc';
        let easySolvedDirection = 'desc';
        let mediumSolvedDirection = 'desc';
        let hardSolvedDirection = 'desc';
        let sectionDirection = 'asc';

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

        document.getElementById('sort-section').addEventListener('click', () => {
            sectionDirection = sectionDirection === 'desc' ? 'asc' : 'desc';
            const sortedData = sortData(filteredData, 'section', sectionDirection, false);
            renderLeaderboard(sortedData);
        });

        document.getElementById('sort-total').addEventListener('click', () => {
            totalSolvedDirection = totalSolvedDirection === 'desc' ? 'asc' : 'desc';
            const sortedData = sortData(filteredData, 'totalSolved', totalSolvedDirection, true);
            renderLeaderboard(sortedData);
        });

        document.getElementById('sort-easy').addEventListener('click', () => {
            easySolvedDirection = easySolvedDirection === 'desc' ? 'asc' : 'desc';
            const sortedData = sortData(filteredData, 'easySolved', easySolvedDirection, true);
            renderLeaderboard(sortedData);
        });

        document.getElementById('sort-medium').addEventListener('click', () => {
            mediumSolvedDirection = mediumSolvedDirection === 'desc' ? 'asc' : 'desc';
            const sortedData = sortData(filteredData, 'mediumSolved', mediumSolvedDirection, true);
            renderLeaderboard(sortedData);
        });

        document.getElementById('sort-hard').addEventListener('click', () => {
            hardSolvedDirection = hardSolvedDirection === 'desc' ? 'asc' : 'desc';
            const sortedData = sortData(filteredData, 'hardSolved', hardSolvedDirection, true);
            renderLeaderboard(sortedData);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
});