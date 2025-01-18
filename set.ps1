# Variables
$rootDir = "project-root"
$folders = @(
    "controllers",
    "models",
    "routes"
)
$files = @{
    "models" = @(
        "taskModel.js",
        "materialModel.js",
        "plantEquipmentModel.js",
        "timeLogModel.js",
        "planModel.js",
        "invoiceModel.js"
    )
    "controllers" = @(
        "taskController.js",
        "materialController.js",
        "plantEquipmentController.js",
        "timeLogController.js",
        "planController.js",
        "invoiceController.js"
    )
    "routes" = @(
        "taskRoutes.js",
        "materialRoutes.js",
        "plantEquipmentRoutes.js",
        "timeLogRoutes.js",
        "planRoutes.js",
        "invoiceRoutes.js"
    )
}

# Step 1: Create folder structure
Write-Host "Creating folder structure..."
New-Item -ItemType Directory -Path $rootDir -Force | Out-Null
foreach ($folder in $folders) {
    New-Item -ItemType Directory -Path "$rootDir\$folder" -Force | Out-Null
}

# Step 2: Create files
Write-Host "Creating files..."
foreach ($folder in $files.Keys) {
    foreach ($file in $files[$folder]) {
        $filePath = "$rootDir\$folder\$file"
        if (-Not (Test-Path $filePath)) {
            New-Item -ItemType File -Path $filePath -Force | Out-Null
        } else {
            Write-Host "File already exists: $filePath - Skipping" -ForegroundColor Yellow
        }
    }
}

Write-Host "Setup complete! Folder structure and files created."
