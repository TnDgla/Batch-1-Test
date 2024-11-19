<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <title>LeetCode Leaderboard</title>
</head>
<body class="bg-gray-900 text-white p-5">
    <div class="container mx-auto my-10">
        <div class="">
            <!-- Leaderboard -->
            <div class="col-span-2 bg-gray-800 rounded-lg shadow-md p-6 overflow-x-auto">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-4xl font-bold">TBPPP Leaderboard</h1>
                    <div class="flex gap-4 items-center">
                        <select id="section-filter" class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="all">All Sections</option>
                            <!-- Options will be dynamically added -->
                        </select>
                        <button id="export-btn" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center transition duration-150 ease-in-out">
                            <i class="fas fa-download mr-2"></i> Export to CSV
                        </button>
                    </div>
                </div>
                <table class="min-w-full bg-gray-900 rounded-lg overflow-hidden shadow-md">
                    <thead>
                        <tr class="bg-gray-700">
                            <th class="p-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                            <th class="p-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Roll Number</th>
                            <th class="p-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                            <th class="p-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Section
                                <button id="sort-section" class="ml-2 hover:text-white">
                                    <i class="fas fa-sort"></i>
                                </button>
                            </th>
                            <th class="p-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Total Solved
                                <button id="sort-total" class="ml-2 hover:text-white">
                                    <i class="fas fa-sort"></i>
                                </button>
                            </th>
                            <th class="p-4 text-left text-xs font-medium text-green-400 uppercase tracking-wider">
                                Easy
                                <button id="sort-easy" class="ml-2 hover:text-white">
                                    <i class="fas fa-sort"></i>
                                </button>
                            </th>
                            <th class="p-4 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                                Medium
                                <button id="sort-medium" class="ml-2 hover:text-white">
                                    <i class="fas fa-sort"></i>
                                </button>
                            </th>
                            <th class="p-4 text-left text-xs font-medium text-red-400 uppercase tracking-wider">
                                Hard
                                <button id="sort-hard" class="ml-2 hover:text-white">
                                    <i class="fas fa-sort"></i>
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody id="leaderboard-body">
                    

                        <!-- Data will be dynamically added here -->
                    </tbody>
                </table>

                <!-- Loading State -->
                <div id="loading-state" class="hidden">
                    <div class="flex justify-center items-center p-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                </div>

                <!-- Error State -->
                <div id="error-state" class="hidden">
                    <div class="text-center p-8 text-red-500">
                        <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
                        <p>Error loading data. Please try again later.</p>
                    </div>
                </div>
            </div>   </div>    </div>
    <script src="index.js"></script>
</body>
</html>
