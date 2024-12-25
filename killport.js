// Script to kill process using port 5000 before starting the server
const { exec } = require('child_process');

exec('npx kill-port 5000', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error killing port 5000: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Stderr: ${stderr}`);
        return;
    }
    console.log(`Port 5000 cleared: ${stdout}`);

    // After clearing the port, start the server
    const serverProcess = exec('npm start');

    serverProcess.stdout.on('data', (data) => {
        console.log(`Server: ${data}`);
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(`Server Error: ${data}`);
    });

    serverProcess.on('close', (code) => {
        console.log(`Server process exited with code ${code}`);
    });
});