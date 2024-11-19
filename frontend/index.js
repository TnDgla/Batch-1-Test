document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch("http://localhost:3001/data");
        const data = await response.json();
        let filteredData = [...data]; // Keep original data separate
        let pinnedStudents = []; // Array to store pinned students
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
            
            // Render pinned students first
            pinnedStudents.forEach((student, index) => {
                const row = createStudentRow(student, index);
                row.classList.add('bg-blue-900'); // Highlight pinned rows
                leaderboardBody.appendChild(row);
            });

            // Render the rest of the students
            sortedData.forEach((student, index) => {
                if (!pinnedStudents.some(pinned => pinned.roll === student.roll)) {
                    const row = createStudentRow(student, index + pinnedStudents.length);
                    leaderboardBody.appendChild(row);
                }
            });

            // Add click event listeners to rows for pinning
            document.querySelectorAll('#leaderboard-body tr').forEach(row => {
                row.addEventListener('click', () => pinStudent(row.dataset.roll));
            });
        };

        // Function to create a student row
        const createStudentRow = (student, index) => {
            const row = document.createElement('tr');
            row.classList.add('border-b', 'border-gray-700', 'hover:bg-gray-800', 'cursor-pointer');
            row.dataset.roll = student.roll;
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
            `;
            return row;
        };

        // Function to pin/unpin a student
        const pinStudent = (roll) => {
            const studentIndex = filteredData.findIndex(student => student.roll === roll);
            if (studentIndex === -1) return;

            const student = filteredData[studentIndex];
            const pinnedIndex = pinnedStudents.findIndex(pinned => pinned.roll === roll);

            if (pinnedIndex === -1) {
                // Pin the student
                pinnedStudents.push(student);
            } else {
                // Unpin the student
                pinnedStudents.splice(pinnedIndex, 1);
            }

            renderLeaderboard(filteredData);
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

        // Function to find a student by roll number or name
        const findStudent = (input) => {
            return filteredData.find(student => 
                student.roll.toLowerCase() === input.toLowerCase() || 
                student.name.toLowerCase() === input.toLowerCase()
            );
        };

        // Function to compare two students
        const compareStudents = (student1, student2) => {
            const comparisonResult = document.getElementById('comparison-result');
            if (!student1 || !student2) {
                comparisonResult.innerHTML = '<p class="text-red-500">One or both students not found. Please check the input.</p>';
                return;
            }

            const compareField = (field, label) => {
                const val1 = parseInt(student1[field]) || 0;
                const val2 = parseInt(student2[field]) || 0;
                let result = '';
                if (val1 > val2) {
                    result = `<span class="winner">${student1.name}</span> > ${student2.name}`;
                } else if (val2 > val1) {
                    result = `<span class="winner">${student2.name}</span> > ${student1.name}`;
                } else {
                    result = 'Equal';
                }
                return `<tr><th>${label}</th><td>${val1}</td><td>${val2}</td><td>${result}</td></tr>`;
            };

            const tableContent = `
                <table class="comparison-table">
                    <tr>
                        <th>Category</th>
                        <th>${student1.name}</th>
                        <th>${student2.name}</th>
                        <th>Result</th>
                    </tr>
                    ${compareField('totalSolved', 'Total')}
                    ${compareField('easySolved', 'Easy')}
                    ${compareField('mediumSolved', 'Medium')}
                    ${compareField('hardSolved', 'Hard')}
                </table>
            `;

            comparisonResult.innerHTML = tableContent;
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

        // Comparison functionality
        document.getElementById('compare-btn').addEventListener('click', () => {
            const user1Input = document.getElementById('user1').value;
            const user2Input = document.getElementById('user2').value;
            const student1 = findStudent(user1Input);
            const student2 = findStudent(user2Input);
            compareStudents(student1, student2);
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
});