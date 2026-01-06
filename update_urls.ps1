# PowerShell script to update remaining localhost URLs
Get-ChildItem -Path "react-frontend/src" -Recurse -Include "*.jsx","*.js" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "localhost:5000") {
        # Add import if not present
        if (-not ($content -match "from '\.\./utils/api'") -and -not ($content -match "from '\.\./\.\./utils/api'")) {
            $content = $content -replace "import React", "import { getApiUrl, API_ENDPOINTS } from '../../utils/api';`nimport React"
        }

        # Replace common endpoints
        $content = $content -replace "http://localhost:5000/api/ask-twin", "getApiUrl(API_ENDPOINTS.ASK_TWIN)"
        $content = $content -replace "http://localhost:5000/api/intrusion/report", "getApiUrl(API_ENDPOINTS.INTRUSION_REPORT)"
        $content = $content -replace "http://localhost:5000/api/intrusion/stream", "getApiUrl(API_ENDPOINTS.INTRUSION_STREAM)"

        Set-Content $_.FullName $content
        Write-Host "Updated: $($_.FullName)"
    }
}
