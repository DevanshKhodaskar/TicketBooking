$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$schemaPath = "database\schema.sql"
$password = "root"  # Change this to your MySQL password

# Read the schema file
$schemaContent = Get-Content $schemaPath -Raw

# Create a pipe and send the password followed by the SQL commands
$process = Start-Process -FilePath $mysqlPath `
    -ArgumentList "-u root -p" `
    -NoNewWindow -RedirectStandardInput $null `
    -RedirectStandardOutput "import_output.txt" `
    -RedirectStandardError "import_error.txt" -PassThru

# Pipe the schema to mysql
$process.StandardInput.WriteLine($password)
$process.StandardInput.WriteLine($schemaContent)
$process.StandardInput.Close()
$process.WaitForExit()

Write-Host "Database import completed!"
Write-Host "Output:"
Get-Content "import_output.txt" -ErrorAction SilentlyContinue
if (Test-Path "import_error.txt") {
    Write-Host "Errors:"
    Get-Content "import_error.txt"
}
