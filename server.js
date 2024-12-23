const express = require('express');
const { parse } = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('./services.db', (err) => {
    if (err) {
        console.error('Failed to connect to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Helper function to format version
function formatVersion(version) {
    const major = Math.floor(version / 100); // Major: Every 100
    const minor = Math.floor((version % 100) / 10); // Minor: Every 10
    const patch = version % 10; // Patch: Remaining
    return `${major}.${minor}.${patch}`;
}

// API endpoint [GET] /:serviceName
app.get('/:serviceName', (req, res) => {
    const serviceName = req.params.serviceName;

    db.get(`SELECT version FROM services WHERE name = ?`, [serviceName], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: `Service '${serviceName}' not found.` });
        } else {
            res.json({ serviceName, fullVersion: `${row.version + 1}`, version: formatVersion(row.version + 1) });
            console.log(`[GET]: /:serviceName : service '${serviceName}' to version ${formatVersion(row.version + 1)}`);

        }
    });

});

// API endpoint [POST] /:serviceName
app.post('/:serviceName', (req, res) => {
    const serviceName = req.params.serviceName;
    const { fullVersion } = req.body;

    if (!fullVersion) {
        res.status(400).json({ error: "Invalid or missing 'fullVersion' in request body" });
        return;
    }

    const newVersion = parseInt(fullVersion);

    db.run(
        `UPDATE services SET version = ? WHERE name = ?`,
        [newVersion, serviceName],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            } else {
                res.status(200).json({ status: "succeeded" });
                console.log(`[POST]: /:serviceName : Updated service '${serviceName}' to version ${newVersion}`);
            }
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
